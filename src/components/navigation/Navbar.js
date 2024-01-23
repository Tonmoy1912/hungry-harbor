"use client";

import React, { Fragment } from 'react'
import Link from 'next/link';

export default function Navbar({ children }) {
    return (
        <Fragment>
            <div className='absolute top-3  w-full flex justify-center'>
                <div className=' w-4/5 p-3 rounded-xl bg-red-300 flex gap-10 '>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/login"}>Login</Link>
                    <Link href={"signup"}>Sign up</Link>
                </div>
            </div>
            {children}
        </Fragment>
    )
}
