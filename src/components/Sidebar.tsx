"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Sidebar = () => {
    return (
        <div className='hidden md:block sticky self-start top-10 mx-2'>

            <div className="p-4 border-b border-b-slate-300">
                <h1 className='text-2xl boarder-10 underline'>Outline</h1>
                工事中
                {/* <ul>
                    <li>test</li>
                    <li>test</li>
                    <li>test</li>
                </ul> */}
            </div>

            <div className="p-4 border-b border-b-slate-300">
                <h1 className='text-2xl boarder-10 underline'>Sponsor</h1>
                募集中
            </div>
        </div>
    );
};

export default Sidebar;