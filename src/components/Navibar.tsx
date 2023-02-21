"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from "react-icons/ai";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
// import { BsFillPersonLinesFill } from "react-icons/bs";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Navibar = () => {

    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };


    return (
        <nav
            className={"w-full h-20 x-[100] border-b border-gray-200 bg-white"}
        >
            <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
                <Link href="/">
                    <Image
                        src={"/images/logo.png"}
                        width={200}
                        height={200}
                        alt="Cheminfuse logo"
                    />
                </Link>

                <div className="hidden md:flex">
                    <div className="flex items-center justify-center gap-2 md:gap-8">
                        <ul style={{ color: `$(linkColor)` }} className="flex items-center justify-center gap-2 md:gap-8 uppercase">
                            <Link href="/" ><li className="ml-10 text-xl hover:border-b">About</li></Link>
                            <Link href="/tools"><li className="ml-10 text-xl hover:border-b">Tools</li></Link>
                            <Link href="/blog/1"><li className="ml-10 text-xl hover:border-b">Blog</li></Link>
                            <Link href="/contact"><li className="ml-10 text-xl hover:border-b">Contact</li></Link>
                        </ul>
                    </div>
                </div>

                <div onClick={handleNav} className="hover:cursor-pointer md:hidden">
                    <AiOutlineMenu size={25} />
                </div>
            </div>

            <div className={nav ? "md:hidden fixed left-0 top-0 w-full h-[100vh] bg-[#818a91]/70 z-50" : ""}>
                <div className={nav
                    ? "fixed left-0 top-0 w-[75%] sm:w-[45%] h-screen bg-white p-10 ease-in duration-200 shadow-l shadow-xl shadow-black"
                    : "fixed left-[-200%] top-0 p-10 ease-in duration-200 shadow-l shadow-xl shadow-black"}>

                    <div className="flex w-full items-center justify-between">
                        <Image src={"/images/logo.png"} width={200} height={200} alt="" />
                        <div onClick={handleNav} className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer">
                            <AiOutlineClose />
                        </div>
                    </div>

                    <div className="border-b border-gray-300 my-4">
                    </div>

                    <div className="py-4 flex flex-col">
                        <ul className="uppercase">
                            <Link href="/"><li className="py-4 text-xl hover:border-b">About</li></Link>
                            <Link href="/tools"><li className="py-4 text-xl hover:border-b">Tools</li></Link>
                            <Link href="/blog/1"><li className="py-4 text-xl hover:border-b">Blog</li></Link>
                            <Link href="/contact"><li className="py-4 text-xl hover:border-b">Contact</li></Link>
                        </ul>
                        <div className="pt-40">
                            <p className="uppercase tracking-widest">Let's Connect</p>
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
                                {/* <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-ind duration-10">
                                    <AiOutlineMail />
                                </div>
                                <div className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-ind duration-10">
                                    <BsFillPersonLinesFill />
                                </div> */}

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navibar;