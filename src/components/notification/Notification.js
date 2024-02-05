"use client";

import React from 'react';
import { motion,AnimatePresence } from 'framer-motion';

//it takes message to display and onClick event which is fitted on OK button
export default function Notification({ message, type, onClick, show }) {
    let color = { heading: "", body: "", button: "" };
    if (type == "Success") {
        color = { heading: "bg-green-600", body: "bg-neutral-300", button: "bg-green-600" };
    }
    else if (type == "Failed") {
        color = { heading: "bg-red-600", body: "bg-neutral-300", button: "bg-red-600" };
    }
    else if (type == "Warning") {
        color = { heading: "bg-amber-500", body: "bg-neutral-300", button: "bg-amber-500" };
    }
    else {//Message
        color = { heading: "bg-sky-600", body: "bg-neutral-300", button: "bg-sky-600" };
    }
    return (
        <AnimatePresence>
            {
                show && 
                (<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition:{
                            duration: 0.5,
                            ease:'easeInOut'
                        }
                    }}
                    transition={{
                        duration: 0.8,
                        // delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                    className='fixed top-0 left-0 h-screen w-screen z-50 backdrop-blur-2xl flex justify-center items-center  text-white '
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale:0.5,
                            transition:{
                                duration: 0.5,
                                ease:'easeInOut'
                            }
                        }}
                        transition={{
                            duration: 0.8,
                            // delay: 0.5,
                            ease: [0, 0.71, 0.2, 1.01]
                        }}
                        className={`min-h-[30%] w-[70%] md:w-[40%] ${color.body} flex flex-col justify-between items-center gap-3 sm:gap-5 rounded-3xl pb-6 overflow-clip`}
                    >
                        <h1 className={`p-3 text-lg text-center font-bold w-full ${color.heading}`}>{type}</h1>
                        <p className={`font-extrabold text-md text-center text-black break-words p-3`}>{message}</p>
                        <button className={`px-8 py-2 ${color.button} rounded-2xl`}
                            onClick={onClick}
                        >
                            OK
                        </button>
                    </motion.div>

                </motion.div>)
            }
            </AnimatePresence>
    )
}
