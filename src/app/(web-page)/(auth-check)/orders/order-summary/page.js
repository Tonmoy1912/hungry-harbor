"use client";

import React, { useEffect, Fragment } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { progressAtom } from '@/store/progressAtom';
import { cartSummarySelector } from '@/store/itemsStore';
import { cartItemsAtom } from '@/store/itemsStore';
import { PrevButton } from '@/components/button/ButtonComponents';
import { IoStarSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import Image from "next/image";

export default function page() {
    const setProgress = useSetRecoilState(progressAtom);
    const cartItems = useRecoilValue(cartItemsAtom);

    useEffect(() => {
        setProgress(false);
        console.log("cartItems from order-summary page", cartItems);
    }, []);
    return (
        <div className='p-2'>
            <PrevButton />
            <h1 className='text-center text-2xl p-1 font-bold'>Order Summary</h1>
            <div className="relative flex flex-col py-2 px-4">
                {
                    cartItems.length == 0 ? (
                        <h1 className="text-2xl font-bold text-blue-900 ">
                            No items found
                        </h1>
                    ) : (
                        cartItems.map(data => <ItemComponent data={data} key={data.item._id} />)
                    )
                }
                <PricingSummary />
            </div>
        </div>
    )
}


function ItemComponent({ data }) {
    return (
        <Fragment>
            <div className='relative border border-slate-500  pb-2 md:pb-0 md:h-48 bg-slate-200 my-0.5 flex  flex-col md:flex-row shadow-sm shadow-slate-600'>
                <div className='w-full h-48 md:w-1/3  md:h-full p-1'>
                    <Image src={data.item.image} height={400} width={400} alt={`${data.item.name}'s image`} className='h-full w-full rounded-md border border-blue-800' ></Image>
                </div>
                <div className='w-full md:w-2/3 md:h-full p-1.5 flex flex-col justify-start gap-1.5 items-start pl-4'>
                    <h1 className='text-xl text-black font-bold'>{data.item.name}</h1>
                    <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold' disabled={true}>{data.item.category}</button>
                    <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{data.item.total_review != 0 ? data.item.rating : "Unrated"}</span> <IoStarSharp />  </button>
                    <button className='px-1.5  rounded-lg  text-black text-xs font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{data.item.price * data.quantity}</span></button>
                    {/* <div className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> In Stock: {data.item.in_stock != 0 ? (data.item.in_stock) : (
                        <button className='px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-semibold' disabled={true}>Out of Stock </button>
                    )}</span> </div> */}
                    <div className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> Quantity : {data.quantity} </span> </div>
                </div>
            </div>
        </Fragment>
    );
}

export function PricingSummary() {
    const cart_summary = useRecoilValue(cartSummarySelector);

    return (
        <div className="sticky bottom-2 p-1  bg-slate-200  flex flex-col gap-2 shadow-sm shadow-slate-600">
            <div className=" flex justify-between items-center ">
                <span>Price ( {cart_summary.total_item} Items )</span>
                <span className="flex gap-1 items-center text-lg font-bold"><FaRupeeSign /> {cart_summary.total_price} </span>
            </div>
            <div className=" flex justify-between items-center">
                <span>Out of stock</span>
                <span> {cart_summary.out_of_stock} </span>
            </div>
            <button className={`px-2 py-1 rounded-sm bg-blue-700 hover:bg-blue-600 text-white font-bold `} >
                <span>Make Payment</span>
            </button>
        </div>
    )
}