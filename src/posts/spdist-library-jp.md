---
title: "PyO3/Maturinを使用したPythonライブラリの作成"
subtitle: "sspdist: 二つの曲線間の距離を計算するライブラリ"
date: "2024-1-25"
eyecatch: "/images/eyecatch/spdist.png"
tags:
  - "Rust"
  - "Python"
  - "X線吸収分光法"
  - "Library"
  - "並列化"
---

この記事は[ホームページ](https://cheminfuse.com/posts/spdist-library)でも公開しているものです。

ブログ投稿を日本語に翻訳しました。

---

**タイトル:** "PyO3/Maturinを使用したPythonライブラリの作成"
**サブタイトル:** "spdist: 二つの曲線間の距離を計算するライブラリ"
**日付:** "2024-1-25"
**アイキャッチ:** "/images/eyecatch/pptemp.png"
**タグ:**

- "Rust"
- "Python"
- "X線吸収分光法"
- "ライブラリ"
- "並列化"

# PyO3/Maturinを使用したPythonライブラリの作成

## この記事で紹介するライブラリ

- [spdist on GitHub](https://github.com/Ameyanagi/spdist)
- [spdist on PyPI](https://pypi.org/project/spdist/)

## 背景

現在、X線吸収分光法（XAS）に関する研究を行っています。この分野では、実験データが1次元スペクトルとして表されます。構造とスペクトルの特徴の関係を理解するために、多くの理論計算が行われます。

XASにおける主な課題の一つは、理論データが常に実験データとは異なるオフセットでシフトされ、異なる垂直スケールで得られるため、理論データを実験データに合わせて調整する必要があります。

## 従来の方法

従来、二つの曲線間の距離を計算するために、平均二乗誤差（MSE）や平均絶対誤差（MAE）が使用されてきました。しかし、この方法はスペクトルの特徴が振動する性質を持つため、局所最小値に落ち着いてしまいがちで、あまり堅牢ではありません。

## 新しいメトリック

この新しいメトリックは、MSEやMAEを置き換えるものではなく、その弱点を補完することを目的としています。そのプロセスは以下の通りです。

- 離散値で表される二つの曲線間のメトリックを測定することから始まります。これにより、二つの配列（x, y）と（x_ref, y_ref）が生成されます。
- 各点と参照曲線との距離を計算します。参照曲線が離散値であるため、距離を計算するには参照曲線の補間が必要です（距離の計算方法については[Wikipediaを参照](https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points)）。
- 各点（x, y）に対する参照曲線までの最小距離の平均を計算します。

この方法の利点は、距離を垂直方向だけでなく斜め方向にも計算するため、参照曲線に近い特徴をより正確に評価できることです。

## Pythonでの実装

Pythonでの実装は単純ですが、時間計算量は\(O(n^2)\)、空間計算量は\(O(1)\)です。

```python
distance = 0

for i in zip(x, y):
    tmp_distance = float('inf')
    for j in zip(x_ref, y_ref):
        if (x_ref == x_ref_next) and (y_ref == y_ref_next):
            # point to point distance
            tmp_distance = min(tmp_distance, ((x - x_ref)**2 + (y - y_ref)**2)**0.5)
            continue
        # point to line distance
        tmp_distance = min(tmp_distance, abs((x_ref_next - x_ref) * (y_ref - y) - (x_ref - x) * (y_ref_next - y_ref)) / ((x_ref_next - x_ref)**2 + (y_ref_next - y_ref)**2)**0.5)

    distance += tmp_distance

distance /= len(x)
```

注: Pythonでは、ネストされたループは遅いため、より効率的な言語であるRustでの実装が必要です。

## Rustでの実装

Rust実装では、[ndarray crate](https://docs.rs/ndarray/latest/ndarray/)と[rayon crate](https://docs.rs/rayon/latest/rayon/)を使用し、Rustの「Borrow Checker」、「Iterator」、「Map」の機能を活用しています。

```rust
pub fn calc_distance_spdist<'a>(
    x: ArrayBase<ViewRepr<&'a f64>, Ix1>,
    y: ArrayBase<ViewRepr<&'a f64>, Ix1>,
    x_ref: ArrayBase<ViewRepr<&'a f64>, Ix1>,
    y_ref: ArrayBase<ViewRepr<&'a f64>, Ix1>,
) -> Result<f64, SpdistError> {
    if x.len() != y.len() {
        return Err(SpdistError::VectorSizeMismatch);
    }

    if x_ref.len() != y_ref.len() {
        return Err(SpdistError::VectorSizeMismatch);
    }

    let distance = Zip::from(&x)
        .and(&y)
        .into_par_iter()
        .map(|(x, y)| {
            Zip::from(&x_ref.slice(s![..-1]))
                .and(&y_ref.slice(s![..-1]))
                .and(&x_ref.slice(s![1..]))
                .and(&y_ref.slice(s![1..]))
                .into_par_iter()
                .map(|(x_ref, y_ref, x_ref_next, y_ref_next)| -> f64 {
                    // return point to point distance
                    if (x_ref == x_ref_next) && (y_ref == y_ref_next) {
                        return ((x - x_ref).powi(2) + (y - y_ref).powi(2)).sqrt();
                    }
                    // return point to line distance
                    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
                    ((x_ref_next - x_ref) * (y_ref - y) - (x_ref - x) * (y_ref_next - y_ref)).abs()
                        / ((x_ref_next - x_ref).powi(2) + (y_ref_next - y_ref).powi(2)).sqrt()
                })
                .min_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Less))
                .unwrap()
        })
        .reduce(|| 0.0f64, |acc, x| acc + x)
        / (x.len() as f64);

    Ok(distance)
}
```

## PyO3とMaturinを使用してPythonにライブラリを公開する

[PyO3とMaturin](https://www.maturin.rs/tutorial)を使用して、RustライブラリをPythonと統合することは非常に簡単です。ローカルインストールは次のコマンドで行います。

```bash
pip install maturin
maturin new

cd spdist
maturin develop
```

Python APIの実装では、PythonとRustの異なる型システムを処理する際に注意が必要です。幸いなことに、Rustの[numpy crate](https://docs.rs/numpy/latest/numpy/)は、PythonのNumPy配列とのインターフェースを簡単にします。

```rust
#[pymodule]
/// A collection of functions for calculating distances between 2 curves
fn spdist<'py>(_py: Python<'py>, m: &'py PyModule) -> PyResult<()> {
    #[pyfn(m)]
    fn spdist<'py>(
        x: PyReadonlyArray1<'py, f64>,
        y: PyReadonlyArray1<'py, f64>,
        x_ref: PyReadonlyArray1<'py, f64>,
        y_ref: PyReadonlyArray1<'py, f64>,
    ) -> PyResult<f64> {
        let distance = rust_lib::calc_distance_spdist(
            x.as_array(),
            y.as_array(),
            x_ref.as_array(),
            y_ref.as_array(),
        );

        match distance {
            Ok(distance) => Ok(distance),
            Err(err) => Err(PyValueError::new_err(err.to_string())),
        }
    }

    Ok(())
}
```

## PyPIへのデプロイ

[Matruin](https://www.maturin.rs/tutorial)と[GitHub Actions](https://docs.github.com/en/actions/)を使用して、PyPIへのデプロイは簡単です。

```bash
mkdir -p .github/workflows
maturin generate-ci github > .github/workflows/CI.yml
```

その後、CI.ymlファイルを編集し、環境セクションからMATURIN_PYPI_TOKENを削除して、maturinが信頼できるパブリッシングを使用するようにし、最後の部分に次のようなものを追加します。

```yaml
release:
  name: Release
  runs-on: ubuntu-latest
  if: "startsWith(github.ref, 'refs/tags/')"
  needs: [linux, windows, macos, sdist]
  permissions:
    id-token: write
  steps:
    - uses: actions/download-artifact@v3
      with:
        name: wheels
    - name: Publish to PyPI
      uses: PyO3/maturin-action@v1
      with:
        command: upload
        args: --non-interactive --skip-existing *
```

## 結論

他言語を使用してPythonライブラリを作成するのは初めてでしたが、Rustを使用してPythonに公開するのは非常に簡単で効率的であることに驚きました。Rustの最新の機能とエコシステムは、開発者の経験と生産性を大幅に向上させます。特に古い言語のC/C++と比較すると、その利点は顕著です。rayon crateを使用して並列化されたコードを簡単に記述できる点は、特筆すべき利点です。Rustは、その堅牢さと現代的な機能により、今後のプロジェクトにも優れた選択肢となるでしょう。
