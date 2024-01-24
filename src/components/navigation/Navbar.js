"use client";

import React, { Fragment } from 'react'
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar({ children }) {
    return (
        <Fragment>
            <div className='absolute top-3  w-full flex justify-center'>
                <div className=' w-4/5 p-3 rounded-xl flex gap-10 '>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/login"}>Login</Link>
                    <Link href={"signup"}>Sign up</Link>
                    <button className='text-red-700' onClick={()=>{signOut({ callbackUrl: '/' })}}> Signout</button>
                </div>
            </div>
            {children}
        </Fragment>
    )
}
