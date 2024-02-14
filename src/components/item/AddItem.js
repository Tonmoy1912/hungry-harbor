"use client";

import React, { Fragment, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { motion, AnimatePresence, progress } from 'framer-motion';
import Image from 'next/image';
import { useRecoilState, useRecoilStateLoadable, useSetRecoilState } from 'recoil';
import { categoryAtom } from '@/store/categoryAtom';
import { notiAtom } from '@/store/notiState';
import { progressAtom } from '@/store/progressAtom';
import { getFirebaseStorage } from '@/config/firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';
import { z } from "zod";

export function AddItemButton() {
    const [show, setShow] = useState(false);
    const defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/items%2Fimage-not-found.png?alt=media&token=4eedd79c-8d24-4a5f-a505-1dd3f28fbc4d";

    return (
        <Fragment>
            <button className='px-3 py-1 bg-blue-900  rounded-lg  flex justify-center gap-1 items-center text-white font-bold hover:bg-blue-800  ' onClick={() => setShow(true)}><IoMdAdd className='scale-110 ' /> Item</button>
            <AddItemInput show={show} setShow={setShow} defaultName={""} defaultUrl={defaultImageUrl} defaultCategory={""} defaultDescription={""} defaultPrice={""} />
        </Fragment>
    );
}

export function AddItemInput({ show, setShow, defaultName, defaultUrl, defaultCategory, defaultDescription, defaultPrice }) {
    const [file, setFile] = useState(null);
    const [name, setName] = useState(defaultName);
    const [image, setImage] = useState(defaultUrl);
    const [category, setCategory] = useState(defaultCategory);
    const [description, setDescription] = useState(defaultDescription);
    const [price, setPrice] = useState(defaultPrice);
    const [categoriesState, setCateoriesState] = useRecoilStateLoadable(categoryAtom);
    const setNoti = useSetRecoilState(notiAtom);
    const [progressState,setProgressState] = useRecoilState(progressAtom);

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
        setShow(false);
    }

    async function AddHandler(e) {
        e.stopPropagation();
        // console.log({name,image,category,description,price});
        setProgressState(true);
        try {
            let newImgaeUrl;
            const BodySchema=z.object({
                name:z.string().trim().min(1),
                description:z.string().trim(),
                price:z.coerce.number().int().nonnegative(),
                category:z.string().trim().min(1).toUpperCase()
            });
            const parsedBody=BodySchema.safeParse({name,category,description,price});
            // console.log("parsed body",parsedBody);
            // return ;
            if(!parsedBody.success){
                setNoti({message:"Enter valid input",type:"Failed",show:true});
                setProgressState(false);
                return ;
            }
            let flag=true;
            for(let i of categoriesState.contents){
                if(i.category==category && category!="ALL"){
                    flag=false;
                    break;
                }
            }

            if(flag){
                setNoti({message:"Enter valid category",type:"Failed",show:true});
                setProgressState(false);
                return ;
            }

            if (file) {
                const storage = await getFirebaseStorage();
                const imageRef = ref(storage, `items/${file.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                newImgaeUrl=url;
            }
            else{
                newImgaeUrl=image;
            }
            let res=await fetch("/api/items/add-item",{
                cache:"no-store",
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({name,image:newImgaeUrl,category,description,price})
            });
            res=await res.json();
            if(res.ok){
                setCateoriesState(prev=>{
                    let newList=prev.map(x=>{
                        if(x.category=="ALL" || x.category==category){
                            return {...x,total:x.total+1}
                        }
                        else{
                            return x;
                        }
                    });
                    return newList;
                })
                setProgressState(false);
                setNoti({message:res.message,type:res.type,show:true});
                setShow(false);
            }
            else{
                setProgressState(false);
                setNoti({message:res.message,type:res.type,show:true});
            }
        }
        catch (err) {
            setNoti({ message: "", type: "", show: false });
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
                    onClick={() => { cancelHandler() }}
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
                        className='w-5/6 sm:w-4/5 md:w-3/5 h-2/3 flex flex-col justify-start items-center pb-2 gap-2 bg-slate-200 rounded-xl shadow-lg shadow-blue-950 overflow-x-clip overflow-y-scroll' onClick={(e) => { e.stopPropagation() }}>
                        <h1 className='text-white text-xl font-bold p-2 bg-blue-600 w-full text-center'>Add Item</h1>

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
                            <h1 className='font-bold text-lg text-black'>Enter Description</h1>
                            <textarea placeholder='Enter description' rows={7} className='p-0.5 w-full rounded-md border border-blue-800' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                        </div>

                        <div className='flex flex-col justify-start items-start w-5/6 gap-1'>
                            <h1 className='font-bold text-lg text-black'>Enter price</h1>
                            <input type="number" placeholder='Enter price' className='p-0.5 w-full rounded-md border border-blue-800' value={price} onChange={(e) => { setPrice(e.target.value) }} />
                        </div>

                        <div className='flex justify-center items-center p-2 gap-4'>
                            {
                                progressState?
                                (<button className='px-2 py-1 rounded-md bg-blue-700 text-white font-semibold animate-pulse' disabled={true} >Processing...</button>) :
                            (<button className='px-2 py-1 rounded-md bg-green-700 text-white font-semibold' onClick={AddHandler}>Add</button>)
                            }
                            <button className='px-2 py-1 rounded-md bg-slate-200 text-black font-semibold border border-black' onClick={(e) => { e.stopPropagation(); cancelHandler(); }}>Cancel</button>
                        </div>
                    </motion.div>

                </motion.div>
            }
        </AnimatePresence>
    )
}