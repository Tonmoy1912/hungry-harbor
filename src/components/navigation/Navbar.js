

import React, { Fragment } from 'react'
import TopBar from './TopBar';
import LeftBar from './LeftBar';
import { FaRegCopyright } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiCodeforces } from "react-icons/si";
import Link from 'next/link';

export default function Navbar({ children }) {
    return (
        <Fragment>
            <TopBar />
            <LeftBar />
            <div className='pt-12 pl-0 sm:pl-56 md:pl-64 w-full min-h-screen bg-white'>
                {children}
            </div>
            <Footer />
        </Fragment>
    )
}

export function Footer() {
    return (
        <div className='pl-0 sm:pl-56 md:pl-64'>
            <div className=' border-l-0 sm:border-l sm:border-l-blue-800 min-h-64 w-full bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 p-8 flex flex-col gap-8 sm:flex-row sm:justify-between'>

                <div className='flex flex-col gap-1 items-start text-white'>
                    <h1 className='text-white font-bold text-lg md:text-2xl' > Hungry Harbor </h1>
                    <p className='text-white  text-xs md:text-sm flex gap-1 items-center'> <FaRegCopyright/> {new Date().getFullYear()} </p>
                    <h1 className='text-white font-bold md:text-lg pt-8 sm:pt-2 ' > Developer </h1>
                    <span>Tonmoy Biswas</span>
                    <span>tonmoybiswas19122002@gmail.com</span>
                    <div className='flex flex-row items-center gap-4 text-xl'>
                        <Link href={"https://www.linkedin.com/in/tonmoy-biswas-227792240/"} target='_blank' > <FaLinkedin /> </Link>
                        <Link href={"https://github.com/Tonmoy1912/"} target='_blank' > <FaGithub /> </Link>
                        <Link href={"https://leetcode.com/tonmoy1912/"} target='_blank' > <SiLeetcode /> </Link>
                        <Link href={"https://codeforces.com/profile/tonmoybiswas1912"} target='_blank' > <SiCodeforces /> </Link>
                    </div>
                </div>

                <div className='flex flex-col gap-1 items-start text-white '>
                    <h1 className='text-white font-bold md:text-lg pb-0 sm:pb-3' > Quick Links </h1>
                    <Link href={"/terms-and-condition"} >Terms & Conditions</Link>
                    <Link href={"refund-and-cancellation"} >Refund & Cancellation</Link>
                </div>

                <div className='flex flex-col gap-1 items-start text-white '>
                    <h1 className='text-white font-bold md:text-lg pb-0 sm:pb-3' > Contact Us </h1>
                    <span>xyz@gmail.com</span>
                    <span>9876543210</span>
                </div>

            </div>
        </div>
    )
}
