export const dynamic = 'force-dynamic';

import React, { Fragment } from 'react';
import Items from '@/models/item/itemSchema';
import mongoose from 'mongoose';
import Image from 'next/image';
import { MdOutlineRateReview } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { StopProgress } from '@/components/util/util';
import { ReviewWindow } from '@/components/review/ReviewComponents';
import { PrevButton } from '@/components/button/ButtonComponents';

export default async function page({ params }) {
    try {
        mongoose.connect(process.env.MONGO_URL);
        const item = await Items.findById(params.id).select({
            global_order: 0, category_order: 0, date: 0, __v: 0
        });
        // console.log(item);
        // console.log(JSON.stringify(item));
        if (!item) {
            return (<h1 className='bg-slate-200 w-full'>
                <span className='text-blue-950 text-2xl font-bold py-1 px-2'>No Item found</span>
            </h1>);
        }
        return (
            <div className='p-2' >
                <PrevButton />
                <div className=' p-2 mt-2  bg-slate-200 shadow-md shadow-slate-500 flex flex-col sm:flex-row items-start rounded-sm'>
                    <div className='h-56 w-full sm:h-80 sm:w-1/2'>
                        <Image src={item.image} alt={`${item.name}-image`} height={500} width={500} className='h-full w-full rounded-sm' />
                    </div>
                    <div className='px-4 py-2 w-full sm:w-1/2 flex flex-col gap-2 justify-start items-start'>
                        <h1 className='text-2xl text-blue-950 font-bold'>{item.name}</h1>
                        <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{item.total_review != 0 ? item.rating.toPrecision(2) : "Unrated"}</span> <IoStarSharp />  </button>
                        <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold' disabled={true}>{item.category}</button>
                        <button className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex gap-1 items-center ' disabled={true}> <MdOutlineRateReview className='scale-125' />  <span>{item.total_review}</span></button>
                        <button className='px-1.5  rounded-lg  text-black text-xs font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{item.price}</span></button>
                        <div className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> In Stock: {item.in_stock != 0 ? (item.in_stock) : (
                            <button className='px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-semibold' disabled={true}>Out of Stock </button>
                        )}</span> </div>
                        <div className='px-1.5 py-0.5 text-sm text-slate-600'>
                            {item.description}
                        </div>
                    </div>
                </div>
                <StopProgress />
                <ReviewWindow itemId={String(item._id)} total_review={String(item.total_review)} />
            </div>
        )
    }
    catch (err) {
        return (
            <div className='p-2 bg-red-300 text-2xl font-bold'>
                {err.message}
            </div>
        )
    }
}


