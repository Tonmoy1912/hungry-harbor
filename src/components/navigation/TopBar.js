"use client";
//completely done
import React, { Fragment, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { navAtom } from '@/store/navState';
import { sessionAtom } from '@/store/sessionStore';
import { IoReorderThree } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function TopBar() {
    const { data, status } = useSession();
    const [navState, setNavState] = useRecoilState(navAtom);
    const setSessionState = useSetRecoilState(sessionAtom);

    useEffect(() => {
        if (status == "authenticated") {
            // console.log()
            // console.log("client session",data);
            setSessionState((session) => { return data.user });
        }
        else if (status == "unauthenticated") {
            setSessionState((session) => { return null });
        }
    }, [status]);
    return (
        <div className='z-50 fixed top-0 left-0 h-14 p-1 w-screen bg-blue-900 flex justify-between items-center'>
            <div className='flex gap-4 px-3'>
                {
                    navState.open ? (
                        <h1 className='flex items-center sm:hidden'><RxCross1 className='text-white scale-125 ' onClick={() => { setNavState({ ...navState, open: false }) }} /></h1>
                    ) : (
                        <h1 className='flex items-center sm:hidden'><IoReorderThree className='text-white scale-150 ' onClick={() => { setNavState({ ...navState, open: true }) }} /></h1>
                    )
                }
                <h1 className='text-white font-bold sm:text-2xl'> Hungry Harbor </h1>
            </div>
            <div className='px-4 flex gap-2'>
                {
                    status != "authenticated" ? (
                        <Fragment>
                            <Link className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-semibold' href={"/login"}>Login</Link>
                            <Link className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-semibold' href={"/signup"}>SignUp</Link>
                        </Fragment>
                    ) :
                        (
                            <button className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-bold' onClick={() => { signOut({ callbackUrl: '/' }) }}>Logout</button>
                        )
                }
            </div>
        </div>
    )
}
