import Image from "next/image";
import Link from "next/link";

const ToolsPage = () => {

    return (
        <div className="w-full text-center">
            {/* <div className='content-center w-full h-[40vh] bg-gradient-to-r from-[#548DFF] to-[#548DFF99] grid md:grid-cols-2'>
                <div className='items-center justify-center'>
                    <div className='flex flex-col text-white justify-center text-center items-center h-full mx-auto'>
                        Tools ページは現在作成中
                    </div>
                </div>
            </div> */}
            <div className="w-full text-left">
                <div className="w-full p-10">
                    <div className="max-w-[1240px] mx-auto">
                        <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
                            Tools
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="relative flex items-center justify-center h-[300px] w-[300px] shadow-xl shadow-gray-400 rounded-xl group bg-gradient-to-r from-[#548DFF] to-[#548DFF99] mx-auto">
                                <Link href="/tools/structure_optimization">
                                    <Image
                                        src="/images/eyecatch/structure_optimization.png"
                                        width={300}
                                        height={300}
                                        className="rounded-xl opacity-20 group-hover:opacity-5 object-fill"
                                        alt="Structure Optimization"
                                    />
                                    <div className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <h3 className='text-2xl text-white traking-wider text-center py-5'>Structure Optimization using NN potential</h3>
                                        <p className='pb-2 pt-2 text-white text-center'>ニューラルネットワークポテンシャルを利用した構造最適化 Webアプリ</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="relative flex items-center justify-center h-[300px] w-[300px] shadow-xl shadow-gray-400 rounded-xl group bg-gradient-to-r from-[#548DFF] to-[#548DFF99] mx-auto">
                                <Link href="/tools/structure_visualization">
                                    <Image
                                        src="/images/eyecatch/structure_optimization.png"
                                        width={300}
                                        height={300}
                                        className="rounded-xl opacity-20 group-hover:opacity-5 object-fill"
                                        alt="Structure Visualization"
                                    />
                                    <div className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <h3 className='text-2xl text-white traking-wider text-center py-5'>Structure Visualization Tool</h3>
                                        <p className='pb-2 pt-2 text-white text-center'>構造最適化 Webアプリで出力したデータの可視化ツール</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ToolsPage;