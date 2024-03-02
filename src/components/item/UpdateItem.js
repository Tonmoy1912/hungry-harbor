"use client";
//we complete tonight

import React, { Fragment, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { motion, AnimatePresence, progress } from 'framer-motion';
import Image from 'next/image';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { categoryAtom } from '@/store/categoryAtom';
import { notiAtom } from '@/store/notiState';
import { progressAtom } from '@/store/progressAtom';
import { getFirebaseStorage } from '@/config/firebase';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from 'uuid';
import { z } from "zod";
import { useQueryClient } from '@tanstack/react-query';
import { toast, Slide } from 'react-toastify';



export function UpdateItemInput({ show, setShow, id, defaultName, defaultUrl, defaultCategory, defaultDescription, defaultPrice, defaultInStock, defaultGlobalOrder, defaultCategoryOrder }) {
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
                        className='w-5/6 sm:w-4/5 md:w-3/5 h-2/3 flex flex-col justify-start items-center pb-2 gap-2 bg-slate-200 rounded-xl shadow-lg shadow-blue-950 overflow-x-clip overflow-y-scroll' >

                        <UpdateItemInputInside show={show} setShow={setShow} inputField={{ id, defaultName, defaultUrl, defaultCategory, defaultDescription, defaultPrice, defaultInStock, defaultGlobalOrder, defaultCategoryOrder }} />

                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>

    )
}

export function UpdateItemInputInside({ show, setShow, inputField }) {
    const { id, defaultName, defaultUrl, defaultCategory, defaultDescription, defaultPrice, defaultInStock, defaultGlobalOrder, defaultCategoryOrder } = inputField;
    const [file, setFile] = useState(null);
    const [name, setName] = useState(defaultName);
    const [image, setImage] = useState(defaultUrl);
    const [category, setCategory] = useState(defaultCategory);
    const [description, setDescription] = useState(defaultDescription);
    const [price, setPrice] = useState(defaultPrice);
    const [categoriesState, setCateoriesState] = useRecoilStateLoadable(categoryAtom);
    const setNoti = useSetRecoilState(notiAtom);
    const [progressState, setProgressState] = useRecoilState(progressAtom);
    const [in_stock, setInStock] = useState(defaultInStock);
    const [global_order, setGlobalOrder] = useState(defaultGlobalOrder);
    const [category_order, setCategoryOrder] = useState(defaultCategoryOrder);
    const queryClient = useQueryClient();

    function fileChangeHandler(e) {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    function cancelHandler() {
        setFile(null);
        setName(defaultName);
        setImage(defaultUrl);
        setCategory(defaultCategory);
        setDescription(defaultDescription);
        setPrice(defaultPrice);
        setInStock(defaultInStock);
        setGlobalOrder(defaultGlobalOrder);
        setCategoryOrder(defaultCategoryOrder);
        setShow(false);
    }

    useEffect(() => {
        setFile(null);
        setName(defaultName);
        setImage(defaultUrl);
        setCategory(defaultCategory);
        setDescription(defaultDescription);
        setPrice(defaultPrice);
        setInStock(defaultInStock);
        setGlobalOrder(defaultGlobalOrder);
        setCategoryOrder(defaultCategoryOrder);
    }, []);

    async function UpdateHandler(e) {
        e.stopPropagation();
        // console.log({file,id,name,image,category,description,price,in_stock,global_order,category_order});
        // return ;
        setProgressState(true);
        try {
            let newImgaeUrl;
            const BodySchema = z.object({
                name: z.string().trim().min(1),
                description: z.string().trim(),
                price: z.coerce.number().int().nonnegative(),
                category: z.string().trim().min(1).toUpperCase(),
                in_stock: z.coerce.number().int().nonnegative(),
                global_order: z.coerce.number().int().nonnegative(),
                category_order: z.coerce.number().int().nonnegative()
            });
            const parsedBody = BodySchema.safeParse({ name, category, description, price, in_stock, global_order, category_order });
            // console.log("parsed body",parsedBody);
            // return ;
            if (!parsedBody.success) {
                setNoti({ message: "Enter valid input", type: "Failed", show: true });
                setProgressState(false);
                return;
            }
            let flag = true;
            for (let i of categoriesState.contents) {
                if (i.category == category && category != "ALL") {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                setNoti({ message: "Enter valid category", type: "Failed", show: true });
                setProgressState(false);
                return;
            }
            let imageRef = null, storage = null;
            if (file) {
                storage = await getFirebaseStorage();
                imageRef = ref(storage, `items/${file.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                newImgaeUrl = url;
            }
            else {
                newImgaeUrl = image;
            }
            let res = await fetch("/api/items/update-item", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, name, image: newImgaeUrl, category, description, price, in_stock, global_order, category_order })
            });
            res = await res.json();
            if (res.ok) {
                // console.log(res.item);
                if (category != defaultCategory) {
                    setCateoriesState(prev => {
                        let newList = prev.map(x => {
                            if (x.category == category) {
                                return { ...x, total: x.total + 1 }
                            }
                            else if (x.category == defaultCategory) {
                                return { ...x, total: x.total - 1 }
                            }
                            else {
                                return x;
                            }
                        });
                        return newList;
                    });
                }
                // setProgressState(false);
                queryClient.invalidateQueries({ queryKey: ["all-items"] })
                setNoti({ message: res.message, type: res.type, show: true });
                setShow(false);
            }
            else {
                //item not added
                //hence delete the uploaded image
                if (file) {
                    deleteObject(imageRef);
                    // .then(()=>console.log("File deleted successfully"))
                    // .catch((err)=>console.log(err.message));
                    // setProgressState(false);
                }
                setNoti({ message: res.message, type: res.type, show: true });
            }
            setProgressState(false);
        }
        catch (err) {
            setNoti({ message: err.message, type: "Failed", show: true });
            setProgressState(false);
            // console.log(err.message);
        }
    }
    useEffect(() => {
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    }, [file])
    return (
        <Fragment>
            <h1 className='text-white text-xl font-bold p-2 bg-blue-600 w-full text-center'>Update Item</h1>

            <div className='h-52 sm:h-64 w-72 sm:w-96  pb-10'>
                <Image src={`${image}`} className='h-full w-full rounded-sm' alt='item-image' height={400} width={400}></Image>
                <input type="file" accept='.jpeg, .png, .jpg' onChange={fileChangeHandler} className='mt-1' />
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Item Name</h1>
                <input type="text" placeholder='Enter item name' className='p-0.5 w-full rounded-md border border-blue-800' value={name} onChange={(e) => { setName(e.target.value) }} />
            </div>




            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Select Category</h1>
                <select className='rounded-md text-center bg-blue-500 w-48 p-0.5 text-white font-bold' value={category} onChange={(e) => { setCategory(e.target.value) }} >
                    {
                        categoriesState.state == "loading" ?
                            (<option className='bg-slate-300' key={"loading"}>"loading..."</option>) :
                            categoriesState.contents.map(x => {
                                if (x.category == "ALL") {
                                    return <option className='bg-slate-300' key="none" value={"ALL"}>None</option>
                                }
                                return (<option value={x.category} key={x.category} className='bg-slate-300'>{x.category}</option>)
                            })
                    }
                </select>
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Description</h1>
                <textarea placeholder='Enter description' rows={7} className='p-0.5 w-full rounded-md border border-blue-800' value={description} onChange={(e) => { setDescription(e.target.value) }} />
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Price</h1>
                <input type="number" placeholder='Enter price' className='p-0.5 w-full rounded-md border border-blue-800' value={price} onChange={(e) => { setPrice(e.target.value) }} />
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>In Stock</h1>
                <input type="number" placeholder='Enter in stock' className='p-0.5 w-full rounded-md border border-blue-800' value={in_stock} onChange={(e) => { setInStock(e.target.value) }} disabled={true} />
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Global Order</h1>
                <input type="number" placeholder='Enter global order' className='p-0.5 w-full rounded-md border border-blue-800' value={global_order} onChange={(e) => { setGlobalOrder(e.target.value) }} />
            </div>

            <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                <h1 className='font-bold text-lg text-black'>Categorical Order</h1>
                <input type="number" placeholder='Enter categorical order' className='p-0.5 w-full rounded-md border border-blue-800' value={category_order} onChange={(e) => { setCategoryOrder(e.target.value) }} />
            </div>

            <div className='flex justify-center items-center p-2 gap-4'>
                {
                    progressState ?
                        (<button className='px-2 py-1 rounded-md bg-blue-700 text-white font-semibold animate-pulse' disabled={true} >Processing...</button>) :
                        (<button className='px-2 py-1 rounded-md bg-green-700 text-white font-semibold' onClick={UpdateHandler}>Update</button>)
                }
                <button className='px-2 py-1 rounded-md bg-slate-200 text-black font-semibold border border-black' onClick={(e) => { e.stopPropagation(); cancelHandler(); }}>Cancel</button>
            </div>
        </Fragment>

    )
}

export function AddStockInput({ id, setShow }) {
    const [add_stock, setAddStock] = useState("0");
    const setProgressState = useSetRecoilState(progressAtom);
    const setNoti = useSetRecoilState(notiAtom);
    const queryClient = useQueryClient();
    async function clickHandler() {
        setProgressState(true);
        fetch("/api/items/update-item/add-in-stock", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, add_stock })
        }).then(res => res.json())
            .then((res) => {
                if (!res.ok) {
                    setNoti({ message: res.message, type: res.type, show: true });
                }
                else {
                    toast.success('Added to stock', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                    });
                }
                queryClient.invalidateQueries({ queryKey: ["all-items"] });
                setProgressState(false);
                setShow(false);
            })
            .catch(err => {
                setNoti({ message: err.message, type: "Failed", show: true });
                setProgressState(false);
                // setShow(false);
            })
    }
    return (
        <div className='p-1 flex flex-row gap-2 justify-start   bg-blue-200 border border-blue-800 rounded-md w-auto '>
            <input type="number" className='p-0.5 rounded-sm bg-slate-100 w-20' placeholder='Enter stocks to add' value={add_stock} onChange={(e) => setAddStock(e.target.value)} />
            <button className='px-2 py-1 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold' onClick={clickHandler}>Add</button>
            <button className='px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-semibold' onClick={() => setShow(false)}>Cancel</button>
        </div>
    )
}