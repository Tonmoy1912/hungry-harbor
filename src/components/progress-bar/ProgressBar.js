"use client";

/*
---------------------just do the followings to use the progress bar-------------------------

import { progressAtom } from '@/store/progressAtom';
import { useSetRecoilState } from 'recoil';

const setProgressState=useSetRecoilState(progressAtom);
setProgressState(true);
setTimeout(()=>{setProgressState(false)},2000);
*/

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { progressAtom } from '@/store/progressAtom';

export default function ProgressBar() {
    const progressState = useRecoilValue(progressAtom);
    return (
        <AnimatePresence>
            {
                progressState &&
                (<motion.div
                    initial={{ width: "0" }}
                    animate={{ width: "50vw" }}
                    exit={{ width: "100vw" }}
                    transition={{
                        duration: 0.8,
                        // delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                    className='h-1 bg-red-700 fixed top-0 left-0 z-50'
                >

                </motion.div>)
            }
        </AnimatePresence>
    )
}


/*
just do the followings to use the progress bar

import { progressAtom } from '@/store/progressAtom';
import { useSetRecoilState } from 'recoil';

const setProgressState=useSetRecoilState(progressAtom);
setProgressState(true);
setTimeout(()=>{setProgressState(false)},2000);
*/