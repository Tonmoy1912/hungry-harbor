"use client";
import React, { Fragment, useRef, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { motion, AnimatePresence } from 'framer-motion';
import { useSetRecoilState, useRecoilState, useRecoilStateLoadable } from 'recoil';
import { categoryAtom } from '@/store/categoryAtom';
import { notiAtom } from '@/store/notiState';
import { progressAtom } from '@/store/progressAtom';



export function AddCategory() {
    const [show, setShow] = useState(false);
    return (
        <Fragment>
            <button className='px-3 py-1 bg-blue-900  rounded-lg  flex justify-center gap-1 items-center text-white font-bold hover:bg-blue-800  ' onClick={() => { setShow(show => !show) }}><IoMdAdd className='scale-110 ' /> Category</button>
            <AddCategoryInput show={show} setShow={setShow} />
        </Fragment>
    );
}

export function RemoveCategory() {
    const [show, setShow] = useState(false);
    return (
        <Fragment>
            <button className='px-3 py-1 bg-red-700  rounded-lg  flex justify-center gap-1 items-center text-white font-bold hover:bg-red-800  ' onClick={() => { setShow(show => !show) }} ><RiDeleteBinLine /> Category</button>
            <RemoveCategoryInput show={show} setShow={setShow} />
        </Fragment>
    );
}

export function SelectCategory() {
    return (
        <Fragment>
            <select name="" id="" className='bg-sky-600 p-1 rounded-lg'>
                <option value="" className='bg-blue-600'>Option1</option>
                <option value="" className='bg-blue-600'>Option2</option>
                <option value="" className='bg-blue-600'>Option3</option>
                <option value="" className='bg-blue-600'>Option4</option>
            </select>
        </Fragment>
    );
}

export function AddCategoryInput({ show, setShow }) {
    const [categoriesState, setCateoriesState] = useRecoilState(categoryAtom);
    const setNoti = useSetRecoilState(notiAtom);
    const setProgressState = useSetRecoilState(progressAtom);
    const ref = useRef(null);
    function addHandler() {
        let category = ref.current.value;
        // console.log(category);
        category = category.trim();
        if (category == "") {
            setNoti({ message: "Enter valid category", type: "Info", show: true });
            return ;
        }
        setProgressState(true);
        fetch("/api/category/add-category", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ category })
        }).then((data) => data.json())
            .then(data => {
                setProgressState(false);
                if (data.ok) {
                    setCateoriesState(categories => [...categories, data.category]);
                    setShow(false);
                }
                else {
                    setNoti({ type: data.type, message: data.message, show: true });
                }
            })
            .catch(err => {
                setProgressState(false);
                setNoti({ type: "Failed", message: err.message, show: true });
            })
    }
    return (
        <AnimatePresence>
            {
                show && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
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
                    className='z-50 fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm'
                >

                    <motion.div
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
                        className='w-5/6 sm:w-3/5 md:w-2/5 flex flex-col justify-start items-center p-2 gap-2 bg-blue-900 rounded-xl shadow-lg shadow-blue-950'>
                        <h1 className='text-white text-xl font-bold p-2'>Add Category</h1>
                        <input ref={ref} type="text" className='w-4/5 p-0.5 rounded-md ' placeholder='Enter category' />
                        <div className='flex justify-center items-center p-2 gap-4'>
                            <button className='px-2 py-1 rounded-md bg-green-700 text-white font-semibold' onClick={addHandler}>Add</button>
                            <button className='px-2 py-1 rounded-md bg-slate-200 text-black font-semibold' onClick={() => { setShow(false) }}>Cancel</button>
                        </div>
                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>
    )
}

export function RemoveCategoryInput({ show, setShow }) {
    const [categoriesState, setCateoriesState] = useRecoilStateLoadable(categoryAtom);
    const setNoti = useSetRecoilState(notiAtom);
    const setProgressState = useSetRecoilState(progressAtom);
    const ref = useRef(null);
    function removeHandler() {
        let category = ref.current.value;
        // console.log(category);
        // return ;
        category = category.trim();
        if (category == "") {
            setNoti({ message: "Enter valid category", type: "Info", show: true });
            return ;
        }
        setProgressState(true);
        fetch("/api/category/remove-category", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ category })
        }).then((data) => data.json())
            .then(data => {
                setProgressState(false);
                if (data.ok) {
                    setCateoriesState(categories => categories.filter(x=>x.category!=data.category));
                    setShow(false);
                }
                else {
                    setNoti({ type: data.type, message: data.message, show: true });
                }
            })
            .catch(err => {
                setProgressState(false);
                setNoti({ type: "Failed", message: err.message, show: true });
            })
    }
    return (
        <AnimatePresence>
            {
                show && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
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
                    className='z-50 fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm'
                >

                    <motion.div
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
                        className='w-5/6 sm:w-3/5 md:w-2/5 flex flex-col justify-start items-center p-2 gap-2 bg-blue-900 rounded-xl shadow-lg shadow-blue-950'>
                        <h1 className='text-white text-xl font-bold p-2'>Select Category</h1>
                        <select ref={ref} className='rounded-md text-center bg-slate-300 w-48'>
                            {
                                categoriesState.state == "loading" ?
                                    (<option>"loading..."</option>) :
                                    categoriesState.contents.map(x => {
                                        return (<option value={x.category} key={x.category}>{x.category}</option>)
                                    })
                            }
                        </select>
                        <div className='flex justify-center items-center p-2 gap-4'>
                            <button className='px-2 py-1 rounded-md bg-red-700 text-white font-semibold' onClick={removeHandler}>Remove</button>
                            <button className='px-2 py-1 rounded-md bg-slate-200 text-black font-semibold' onClick={() => { setShow(false) }}>Cancel</button>
                        </div>
                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>
    )
}