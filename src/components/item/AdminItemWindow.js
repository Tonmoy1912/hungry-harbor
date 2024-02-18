"use client";

import React, { Fragment, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState, useRecoilValue } from 'recoil';
import { categoryAtom } from '@/store/categoryAtom';
import { selectedCategoryAtom } from '@/store/categoryAtom';
import { FaSearch } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlinePreview } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { notiAtom } from '@/store/notiState';
import { filteredItemsSelector, allItemsAtom, searchAtom } from '@/store/itemsStore';
import { UpdateItemInput, AddStockInput } from './UpdateItem';
import Image from 'next/image';

export default function AdminItemWindow() {
    const setNoti = useSetRecoilState(notiAtom);
    const setAllItems = useSetRecoilState(allItemsAtom);
    const filteredItems = useRecoilValue(filteredItemsSelector);
    const [updateData, setUpdateData] = useState({ id: "", name: "", image: "", category: "", description: "", price: "", global_order: "", category_order: "", in_stock: "" });
    const [updateShow, setUpdateShow] = useState(false);
    const { data: items, isLoading } = useQuery({
        queryKey: ["all-items"],
        queryFn: async function () {
            try {
                let res = await fetch("/api/items/get-items", {
                    cache: "no-store",
                    method: "GET"
                });
                res = await res.json();
                if (res.ok) {
                    return res.items;
                }
                else {
                    setNoti({ message: res.message, type: res.type, show: true });
                    return [];
                }
            }
            catch (err) {
                setNoti({ message: err.message, type: "Failed", show: true });
                return [];
            }
        }
    });

    useEffect(() => {
        if (!isLoading) {
            setAllItems(items);
        }
    }, [isLoading, items]);


    return (
        <Fragment>
            <div className='mx-4 my-6 border border-blue-900 shadow-lg shadow-blue-950 bg-blue-900 rounded-md overflow-clip'>
                <TopBar />
                {
                    isLoading ? (
                        <h1 className='bg-slate-200 '>
                            <span className='text-blue-950 text-2xl font-bold animate-pulse py-1 px-2'>Loading...</span>
                        </h1>
                    ) : (
                        filteredItems.length == 0 ? (
                            <h1 className='bg-slate-200 '>
                                <span className='text-blue-950 text-2xl font-bold py-1 px-2'>No Item found</span>
                            </h1>
                        ) : (
                            filteredItems.map(item => (<AdminItemBox item={item} key={item.name} setUpdateData={setUpdateData} setUpdateShow={setUpdateShow} />))
                        )
                    )
                }

            </div>
            <UpdateItemInput show={updateShow} setShow={setUpdateShow} id={updateData._id} defaultName={updateData.name} defaultUrl={updateData.image} defaultCategory={updateData.category} defaultDescription={updateData.description} defaultPrice={`${updateData.price}`} defaultInStock={`${updateData.in_stock}`} defaultGlobalOrder={`${updateData.global_order}`} defaultCategoryOrder={`${updateData.category_order}`} />
        </Fragment>
    )
}

//top bar of the items window
function TopBar() {
    const categoriesState = useRecoilValueLoadable(categoryAtom);
    const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryAtom);
    const [search, setSearch] = useState("");
    const setSearchState = useSetRecoilState(searchAtom);

    //debounce
    useEffect(() => {
        const id = setTimeout(() => {
            setSearchState(search);
        }, 500);

        return () => {
            clearTimeout(id);
        }
    }, [search]);

    //to clear global search value on page leave
    useEffect(() => {
        return () => {
            setSearchState("");
        };
    }, [])
    return (
        <Fragment>
            <div className='bg-blue-500 p-2 flex flex-col gap-3 items-center  md:flex-row md:justify-between md:items-center rounded-t-md mb-0.5'>
                <select className='bg-transparent text-center text-sm md:text-md border-2 border-blue-700 rounded-md w-48 p-0.5 text-white font-bold order-2 md:order-1' value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value) }} >
                    {
                        categoriesState.state == "loading" ?
                            (<option className='bg-blue-300' key={"loading"}>"loading..."</option>) :
                            categoriesState.contents.map(x => {
                                return (<option value={x.category} key={x.category} className='bg-blue-300'>{`${x.category} (${x.total})`}</option>)
                            })
                    }
                </select>
                <div className='flex items-center gap-2 order-1 md:order-2'>
                    <FaSearch className='text-white scale-110' />
                    <input type="search" className='p-0.5 md:p-1 text-blue-800 w-64 rounded-lg border border-white bg-blue-50 shadow-inner shadow-blue-500 ' placeholder='Search by name' value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
        </Fragment>
    );
}

function AdminItemBox({ item, setUpdateData, setUpdateShow }) {
    const [showAddStock, setShowAddStock] = useState(false);
    function editClickHandler() {
        setUpdateData({ ...item });
        setUpdateShow(true);
    }
    return (
        <Fragment>
            <div className='relative pb-2 md:pb-0 md:h-64 bg-slate-200 my-0.5 flex  flex-col md:flex-row'>
                <div className='w-full h-48 md:w-1/3  md:h-full p-1'>
                    <Image src={item.image} height={400} width={400} alt={`${item.name}'s image`} className='h-full w-full rounded-md border border-blue-800' ></Image>
                </div>
                <div className='w-full md:w-2/3 md:h-full p-1.5 flex flex-col justify-start gap-1.5 items-start pl-4'>
                    <h1 className='text-xl text-black font-bold'>{item.name}</h1>
                    <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-sm font-semibold flex gap-1 items-center ' disabled={true}>  <span>{item.total_review != 0 ? item.rating : "Unrated"}</span> <IoStarSharp />  </button>
                    <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-sm font-semibold' disabled={true}>{item.category}</button>
                    <button className='px-1.5 py-0.5 rounded-lg  text-black text-sm font-semibold flex gap-1 items-center ' disabled={true}> <MdOutlineRateReview className='scale-125' />  <span>{item.total_review}</span></button>
                    <button className='px-1.5  rounded-lg  text-black text-sm font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{item.price}</span></button>
                    <button className='px-1.5 py-0.5 rounded-lg  text-black text-sm font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> In Stock: {item.in_stock}</span> < AddStockButton show={showAddStock} setShow={setShowAddStock} id={item._id} /></button>
                    <div className='flex gap-3'>
                        <button className='px-1.5 py-0.5 rounded-lg bg-slate-600 text-white text-sm font-semibold' disabled={true}>Global order: {item.global_order} </button>
                        <button className='px-1.5 py-0.5 rounded-lg bg-slate-600 text-white text-sm font-semibold' disabled={true}>Categorical order: {item.category_order}</button>
                    </div>
                </div>
                <div className='relative mt-2  md:absolute bottom-2 right-2 flex gap-3 items-center justify-self-end md:mt-4  px-2 text-sm self-end'>
                    <button className='px-2 py-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold flex gap-1 items-center ' > View <MdOutlinePreview className='scale-110' /> </button>
                    <button className='px-2 py-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold flex gap-1 items-center' onClick={editClickHandler} > Edit <FaRegEdit className='scale-110' /></button>
                </div>
            </div>
        </Fragment>
    )
}

function AddStockButton({ show, id, setShow }) {
    return (
        <Fragment>
                <button className='px-1.5 py-0.5 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-semibold flex gap-1 items-center ' onClick={()=>{setShow(true),console.log("clicked")}}> Add stock</button>
            {
                show && 
                <AddStockInput id={id} setShow={setShow} />
            }
        </Fragment>
    )
}