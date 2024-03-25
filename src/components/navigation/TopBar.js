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
import { useRouter } from 'next/navigation';
// import ProgressBar from '../progress-bar/ProgressBar';
import Link from 'next/link';
import { notificatioCountAtom } from '@/store/notificationCountAtom';
import { NewNotiIndicatorTop } from '../notification-page-components/NotificationPageComponents';

export default function TopBar() {
    const { data, status } = useSession();
    const [navState, setNavState] = useRecoilState(navAtom);
    const setSessionState = useSetRecoilState(sessionAtom);
    const router=useRouter();
    const setNotiCount=useSetRecoilState(notificatioCountAtom);

    useEffect(() => {
        if (status == "authenticated") {
            // console.log()
            // console.log("client session",data);
            setSessionState((session) => { return { ...data.user } });
        }
        else if (status == "unauthenticated") {
            setSessionState((session) => { return null });
        }
        //setting unread notification count
        fetch("/api/notification/get-unread-noti-count",{
            cache:"no-store",
            method:"GET"
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.ok){
                setNotiCount(res.noti_count);
            }
        })
        .catch(err=>{});
    }, [status]);
    return (
        <Fragment>
            <div className='z-50 fixed top-0 left-0 h-12 p-1 w-screen bg-blue-950 flex justify-between items-center border-b border-b-blue-800'>
                <div className='flex gap-4 px-3'>
                    {
                        navState.open ? (
                            <h1 className='flex items-center sm:hidden relative'><RxCross1 className='text-white scale-125 ' onClick={() => { setNavState({ ...navState, open: false }) }} />   </h1>
                        ) : (
                            <h1 className='flex items-center sm:hidden relative'><IoReorderThree className='text-white scale-150 ' onClick={() => { setNavState({ ...navState, open: true }) }} /> <NewNotiIndicatorTop /> </h1>
                        )
                    }
                    <h1 className='relative text-white font-bold sm:text-2xl cursor-pointer' onClick={()=>{router.push("/")}} > Hungry Harbor  </h1>
                </div>
                <div className='px-4 flex gap-2'>
                    {
                        status != "authenticated" ? (
                            <Fragment>
                                <Link className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-semibold text-sm' href={"/login"}>Login</Link>
                                <Link className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-semibold text-sm' href={"/signup"}>SignUp</Link>
                            </Fragment>
                        ) :
                            (
                                <button className='px-2 py-1 bg-cyan-600 rounded-lg  text-white font-bold text-sm' onClick={() => { signOut({ callbackUrl: '/' }) }}>Logout</button>
                            )
                    }
                </div>
            </div>
            
            {/* <ProgressBar/> */}
        </Fragment>
    )
}
