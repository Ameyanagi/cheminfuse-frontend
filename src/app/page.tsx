import Next3Dmol from "../components/Next3Dmol";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="w-full text-center">
      <div className="content-center w-full h-[40vh] bg-gradient-to-r from-[#548DFF] to-[#548DFF99] grid md:grid-cols-2">
        <div className="items-center justify-center">
          <div className="flex flex-col text-white justify-center text-center items-center h-full mx-auto">
            <h2 className="text-3xl m-4">激動のDX時代を生き抜く化学者へ</h2>
            <p>めまぐるしく変化する技術、活用したいけどとっかかりが・・・。</p>
            <p>化学にAIなんて関係ないでしょ・・・。</p>
            <p>そんなあなたの学びを支援する情報サイト。</p>
          </div>
        </div>
        <Next3Dmol
          className=" relative w-full h-[40vh] hidden md:block"
          structure=""
          format={"mol2"}
          href={"/mol2/toppage.mol2"}
        />
      </div>

      <div className="max-w-[1240px] w-full mx-auto p-2 py-10 justify-center items-center text-left">
        <h1 className="bg-[#404040] text-white rounded-lg w-[20rem] text-center text-2xl m-2 p-1 shadow-lg">
          新しい化学のツール
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="indent-4">
            <p className="p-1">
              近年、IT分野は急激に発展している。この背景には、分野として新しい要素がある一方で、作成時間などの物理的な制約を受けるハードウェア業界に比べて、ソフトウェア分野がプロトタイピングやPDCAサイクルの高速化に向いていることがある。
            </p>
            <p className="p-1">
              一方で、化学分野の成長速度はIT分野に比べて遅く、私は未だにフラスコを使用して実験している。その理由の一つには、やはり物理的な制約があるためPDCAサイクルが遅いことが挙げられる。
            </p>
            <p className="p-1">
              AI分野で「転移学習」という概念がある。AI(機械学習)の分野で転移学習という概念がある。類似性を有する分野のデータを利用して、新しい分野のデータを学習させることで、新しい分野のデータをより効率的に学習させることができる。この考え方を分野全体に適用して見ると、他分野からの方法論を化学分野に取り入れることで化学のさらなる発展が期待できる。現在、このような試みは行われているが、全ての化学者が取り入れることができているわけではない。その理由には、他の分野を学ぶ時間がない、技術的な参入障壁が高いなどが挙げられる。しかし、現在の米国の求人市場では化学分野に関する深い経験だけでなく、プログラミングスキルが求められ始めていること、日本ではプログラミング教育が義務化されるなど、化学者にとってIT分野の技術を学び、自身の分野に応用していくことがますます重要になっている。
            </p>
            <p className="p-1">
              このサイトでは、化学者がIT分野の技術を取り入れ、化学分野を発展させることの可能性について紹介する。私自身もまだ若輩者であり、これからの化学の未来を見通せるわけではないが、このように情報をまとめ、共有することで、自身の学びを深めるとともに、化学の分野の発展に貢献できればと考えている。
            </p>
          </div>
          <div className="mx-auto text-center">
            <Image
              src="/images/robot-chemistry_1.png"
              alt="Robot doing chemistry"
              width={500}
              height={500}
            />
            AIが実験！？こんな世界も来るんですかね・・・？
          </div>
        </div>
      </div>
      <div className="max-w-[1240px] w-full mx-auto p-2 py-10 justify-center items-center text-left">
        <h1 className="bg-[#404040] text-white rounded-lg w-[20rem] text-center text-2xl m-2 p-1 shadow-lg">
          新しい働き方、自動化
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="mx-auto text-center">
            <Image
              src="/images/lab-automation.png"
              alt="Robot doing chemistry"
              width={500}
              height={500}
            />
            一緒に新しい働き方を考えていきませんか？
          </div>
          <div className="indent-4">
            <p className="p-1">
              日本企業は長い間、メンバーシップ型の雇用、長期労働を前提とした働き方をしてきました。しかし、残業規制が厳しくなったことで労働時間が短縮されることや、ジョブ型の雇用や非正規雇用、フリーランス、アウトソーシングなどの拡大により、従来のスペシャリストが育ちにくい環境が生まれました。このような状況では従来と同じ働き方をした場合に、過去の人たちのような成果は絶対に出ません。
            </p>
            <p className="p-1">
              ではどうするべきなのか？
              こうした状況に対して、私が提唱する解決策は非属人化と自動化です。非属人化は、作業手順書（SOP）の作成により、誰でも作業ができるように整備することで、人件費の削減や人材の確保が容易になるというメリットがあります。これはすでに多くの企業において実践されています。しかし、化学の分野では、最低限の化学的な知識がないとSOP自体が理解できない、再現できない場合があるため、SOPの効果は他の分野に比べると低いと考えられます。
            </p>
            <p className="p-1">
              そこで重要になってくるのが自動化です。自動化は、作業手順をコンピュータが理解できる形で記載し、コンピュータに作業を行ってもらうことです。コンピュータは、人間と違って同じ環境にすれば同じように動作するため、人間とSOPのように再現性の問題が生じません。また、同じ精度で何度も同じ作業を繰り返すことができます。
            </p>
            <p className="p-1">
              自動化にはプログラム(自動化のSOP)を作成することが必要です。そのため、まずはプログラミング言語を学び、機械がどのような入出力ができるかを知り、自分の作業をどのようにコンピュータが理解できる形で記述するかを考える必要があります。コンピュータを使って自動化することで、非属人化できる作業は人から手放し、最小限の労力もしくは低コストの労力で生産性を確保できるようになります。
            </p>
            <p className="p-1">
              このサイトではこのような新しい働き方につながるような情報も発信してこうと思います。
            </p>
          </div>
        </div>
      </div>
      <div
        id="about"
        className="max-w-[1240px] w-full mx-auto p-2 py-10 justify-center items-center text-left"
      >
        <h1 className="bg-[#404040] text-white rounded-lg w-[20rem] text-center text-2xl m-2 p-1 shadow-lg">
          化学者のビジネス
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="indent-4">
            <p className="p-1">
              大学で学んだ化学と企業での化学には大きな乖離があると言われます。私自身、どちらも好きな分野ですが、大学での化学を学んだ人が、そのままの感覚で企業の化学を行うと失敗することが多いと感じます。
            </p>
            <p className="p-1">
              そこで、私の経験をもとに、企業で求められる化学者のスキルやノウハウについて発信していきます。化学は、製品開発や品質管理、生産工程の改善、競合他社との差別化、顧客のニーズに合った製品開発など、様々なビジネスの現場で活躍する分野です。
            </p>
            <p className="p-1">
              しかし、企業での化学には、大学で学んだ理論だけでは足りない実践的なスキルやノウハウが求められます。たとえば、研究開発部門だけでも、マーケティングの知識、プロジェクトマネジメント、契約書の読み方、製品のライフサイクル、製品のライセンス、製品の登録、製品の販売、製品のサポートなど、化学の知識だけではなく、さまざまなビジネスの知識が必要です。
            </p>
            <p className="p-1">
              化学者としてビジネスの現場で活躍するためには、企業の視点からの化学的な問題解決や製品開発を考える能力が必要です。私は、自分自身が企業での化学に携わった経験をもとに、企業での化学の考え方を発信していくことで、化学産業に貢献したいと思っています。企業の現場での化学に興味がある方や、化学者がビジネスの現場でどのように活躍しているか知りたい方は、ぜひ参考にしていただければ幸いです。
            </p>
          </div>
          <div className="mx-auto text-center">
            <Image
              src="/images/Chemical-industry.png"
              alt="Robot doing chemistry"
              width={500}
              height={500}
            />
            ビジネスに必要なことを学んでみませんか？
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

