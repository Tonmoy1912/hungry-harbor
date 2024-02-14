"use client";
import React from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmBox({ onYes, onCancel, show, text }) {
    return (
        <AnimatePresence>
            {show &&
                (<motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 0.5,
                        transition: {
                            duration: 0.5,
                            ease: 'easeInOut'
                        }
                    }}
                    transition={{
                        duration: 0.8,
                        // delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                    className='z-50 fixed top-0 left-0 h-screen w-screen flex justify-center items-center'
                >
                    <div className={`min-h-[30%] w-[70%] md:w-[40%] bg-blue-900 shadow-lg shadow-blue-950 text-2xl flex flex-col justify-around font-extrabold  items-center gap-3 sm:gap-5 rounded-3xl pb-6 overflow-clip`}>
                        <p className={`font-extrabold text-md text-center text-white break-words p-3`}>{text}</p>
                        <div className='flex justify-center items-center gap-5'>
                            <button className='h-8 w-16 bg-red-700  text-white font-semibold text-sm rounded-lg hover:bg-red-600' onClick={onYes}> Yes </button>
                            <button className='h-8 w-16 bg-slate-300  text-black font-semibold text-sm rounded-lg hover:bg-slate-200' onClick={onCancel}> Cancel </button>
                        </div>
                    </div>
                </motion.div>)
            }
        </AnimatePresence>
    );
}