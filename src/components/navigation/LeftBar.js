"use client";
//completely done
import React, { Fragment } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { navAtom } from '@/store/navState';
import { sessionAtom } from '@/store/sessionStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LeftBar() {
    const [navState, setNavState] = useRecoilState(navAtom);
    const sessionState = useRecoilValue(sessionAtom);
    const pathName = usePathname();
    useEffect(() => {
        // console.log(pathName.split("/"));
        const arr = pathName.split("/");
        setNavState({ ...navState, curTab: arr[1] });
    }, [pathName]);
    return (
        <Fragment>
            {/* form desktop */}
            <div className='z-40 hidden fixed top-0 left-0  sm:w-56 md:w-64 h-screen pt-14 bg-blue-950 sm:flex flex-col justify-center border-r border-r-blue-950'>
                <div className='flex flex-col justify-start gap-6 items-center text-white text-lg text-center' >

                    <Link href={"/"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "" }) }}>Home</Link>
                    <Link href={"/items"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "items" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "items" }) }}>Items</Link>
                    <Link href={"/notifications"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "notifications" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "notifications" }) }}>Notifications</Link>
                    <Link href={"/orders"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "orders" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "orders" }) }}>Orders</Link>
                    <Link href={"/wishlist"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "wishlist" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "wishlist" }) }}>Wishlist</Link>
                    <Link href={"/cart"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "cart" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "cart" }) }}>Cart</Link>
                    {
                        sessionState && sessionState.isAdmin &&
                        <Link href={"/control-panel/dashboard"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "dashboard" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "dashboard" }) }}>Control Panel</Link>
                    }
                    <Link href={"/profile"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "profile" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "profile" }) }}>
                        Profile
                    </Link>
                </div>
            </div>

            {/* for mobile */}
            <AnimatePresence>
                {
                    navState.open &&
                    <motion.div
                        initial={{
                            x: "-14rem"
                        }}
                        animate={{
                            x: "0rem"
                        }}
                        exit={{
                            x: "-14rem"
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                        className='z-40 sm:hidden fixed top-0 left-0 pt-14 w-56 h-screen bg-blue-950 flex  flex-col justify-start border-r border-r-blue-950'>

                        <div className='flex flex-col justify-start gap-6 items-center text-white text-lg pt-8 text-center' >

                            <Link href={"/"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "", open: false }) }}>Home</Link>
                            <Link href={"/items"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "items" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "items", open: false }) }}>items</Link>
                            <Link href={"/notifications"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "notifications" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "notifications", open: false }) }}>Notifications</Link>
                            <Link href={"/orders"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "orders" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "orders", open: false }) }}>Orders</Link>
                            <Link href={"/wishlist"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "wishlist" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "wishlist", open: false }) }}>Wishlist</Link>
                            <Link href={"/cart"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "cart" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "cart", open: false }) }}>Cart</Link>
                            {
                                sessionState && sessionState.isAdmin &&
                                <Link href={"/control-panel/dashboard"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "dashboard" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "dashboard", open: false  }) }}>Control Panel</Link>
                            }
                            <Link href={"/profile"} className={`border border-white w-3/4 py-1 px-3 rounded-full hover:bg-blue-300 hover:text-black font-bold ${navState.curTab == "profile" ? "bg-blue-300 text-black" : ""}`} onClick={() => { setNavState({ ...navState, curTab: "profile", open: false }) }}>
                                Profile
                            </Link>
                        </div>

                    </motion.div>
                }
            </AnimatePresence>
        </Fragment>
    )
}
