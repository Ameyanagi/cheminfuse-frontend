import Link from "next/link";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="max-w-[1240px] m-auto w-full">
            <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
                Contact

            </p>
            {/* <h2 className="py-2">Get in touch</h2> */}
            <div className="grid lg:grid-cols-5 gap-8">

                <div className="col-span-3 lg:col-span-2 w-full h-full shadow-xl shadow-gray-400 rounded-xl p-4">
                    <div className="lg:p-4 h-full">
                        <div>
                            <img className="rounded-xl hover:scale-105 ease-in duration-200" src="https://unsplash.com/photos/guiQYiRxkZY/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTZ8fGVtYWlsfGVufDB8fHx8MTY3NjkwODY4OA&w=640" alt="" />
                        </div>

                        <div>
                            <h2 className="py-2 text-2xl">
                                Ameyanagi, Ph.D.
                            </h2>
                            <p>化学者、データサイエンティスト、プログラマー、プロンプトエンジニア</p>
                            <p className="py-4">技術的な質問、記事の要望、仕事の依頼、広告掲載の依頼など気軽にお問い合わせください。</p>

                            <div className="pt-10">
                                <p className="uppercase tracking-widest">Let's Connect（追加予定）</p>
                                <div className="flex items-center justify-between my-4 w-full sm:w-[80%]">
                                    {/* <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-ind duration-10">
                                    <FaLinkedinIn />
                                </div> */}
                                    <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-ind duration-10">
                                        <Link
                                            href="https://github.com/Ameyanagi"
                                        >
                                            <FaGithub />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    </div>
                    <div className='col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl lg:p-4'>
                        <div className='p-4'>
                            <form
                                action='https://api.formcake.com/api/form/6ab6782a-1d86-456b-bfa4-c5a41dfac508/submission'
                                method='POST'
                            >
                                <div className='grid md:grid-cols-2 gap-4 w-full py-2'>
                                    <div className='flex flex-col'>
                                        <label className='uppercase text-sm py-2'>Name</label>
                                        <input
                                            className='border-2 rounded-lg p-3 flex border-gray-300'
                                            type='text'
                                            name='name'
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label className='uppercase text-sm py-2'>
                                            Phone Number
                                        </label>
                                        <input
                                            className='border-2 rounded-lg p-3 flex border-gray-300'
                                            type='text'
                                            name='phone'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col py-2'>
                                    <label className='uppercase text-sm py-2'>Email</label>
                                    <input
                                        className='border-2 rounded-lg p-3 flex border-gray-300'
                                        type='email'
                                        name='email'
                                    />
                                </div>
                                <div className='flex flex-col py-2'>
                                    <label className='uppercase text-sm py-2'>Subject</label>
                                    <input
                                        className='border-2 rounded-lg p-3 flex border-gray-300'
                                        type='text'
                                        name='subject'
                                    />
                                </div>
                                <div className='flex flex-col py-2'>
                                    <label className='uppercase text-sm py-2'>Message</label>
                                    <textarea
                                        className='border-2 rounded-lg p-3 border-gray-300'
                                        rows={10}
                                        name='message'
                                    ></textarea>
                                </div>
                                <button className='w-full p-4 text-gray-100 mt-4'>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Contact;


