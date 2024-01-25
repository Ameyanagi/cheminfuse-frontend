---
title: "Creating a Python Library Using PyO3/Maturin"
subtitle: "sspdist: A Library for Calculating Distance Between Two Curve"
date: "2024-1-25"
eyecatch: "/images/eyecatch/spdist.png"
tags:
  - "Rust"
  - "Python"
  - "X-ray Absorption Spectroscopy"
  - "Library"
  - "Parallelization"
---

# Creating a Python Library Using PyO3/Maturin

## Library Overview

In this article, we discuss:

- [spdist on GitHub](https://github.com/Ameyanagi/spdist)
- [spdist on PyPI](https://pypi.org/project/spdist/)

## Background

My current work involves X-ray absorption spectroscopy (XAS), where experimental data is represented as a 1D spectrum. This field heavily relies on theoretical calculations to understand the relationship between structure and spectral features.

A significant challenge in XAS is aligning theoretical data, often offset and scaled differently from experimental data. This necessitates adjusting the theoretical data to match the experimental observations.

## Conventional Method

Traditionally, the Mean Squared Error (MSE) or Mean Absolute Error (MAE) are used to calculate the distance between two curves. However, this approach is not robust due to the oscillatory nature of spectral features, often leading to settling at local minima.

## A New Metric

This new metric is not meant to replace, but rather to complement the weaknesses of MSE or MAE. The process involves:

- Measuring the metric between two curves represented by discrete values, (two arrays of (x, y) and (x_ref, y_ref)).
- Calculating the distance between each point and the reference curve. With discrete values, interpolating the reference curve is necessary to compute distances (see [Wikipedia for calculation of the point to line](https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points)).
- Computing the average of the minimum distances for each point (x, y) relative to the reference curve.

The advantage of this method is that it calculates distances not just vertically but diagonally, allowing for a more accurate assessment of features close to the reference curve.

## Implementation in Python

The Python implementation is straightforward, albeit with a time complexity of $O(n^2)$ and space complexity of $O(1)$:

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

Note: In Python, nested loops can be slow, suggesting a need for implementation in a more efficient language like Rust.

## Implementation in Rust

The Rust implementation utilizes the [ndarray crate](https://docs.rs/ndarray/latest/ndarray/) and [rayon crate](https://docs.rs/rayon/latest/rayon/) for parallelization. Rust's 'Borrow Checker', 'Iterator', and 'Map' features are one of the most significant advantages over C/C++.

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

## Exposing the Library to Python with PyO3 and Maturin

Integrating the Rust library with Python is seamless using [PyO3 and Maturin](https://www.maturin.rs/tutorial). The following commands facilitate the local installation:

```bash
pip install maturin
maturin new

cd spdist
maturin develop
```

The Python API implementation requires careful handling of the differing type systems in Python and Rust. Fortunately, the [numpy crate](https://docs.rs/numpy/latest/numpy/) in Rust simplifies interfacing with NumPy arrays in Python.

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

## Deploying to PyPI

Deploying to PyPI is streamlined using [Maturin](https://www.maturin.rs/tutorial) and [GitHub Actions](https://docs.github.com/en/actions/):

```bash
mkdir -p .github/workflows
maturin generate-ci github > .github/workflows/CI.yml
```

Edit the CI.yml file, delete MATURIN_PYPI_TOKEN from the env section to make maturin use trusted publishing, add id-token: write to the action's permissions the last part will look something like the following.

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

And it is deployed to PyPI!

## Conclusion

This was my first experience creating a Python library using Rust, and I was pleasantly surprised by the ease and efficiency of the process. Rust's modern features and ecosystem significantly enhance developer experience and productivity, especially compared to older languages like C/C++. The ease of writing parallelized code with the rayon crate is a notable advantage. Rust's robustness and modern features make it an excellent choice for future projects.
