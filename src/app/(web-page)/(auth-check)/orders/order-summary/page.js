"use client";

import React, { useEffect, Fragment, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { progressAtom } from '@/store/progressAtom';
import { cartSummarySelector } from '@/store/itemsStore';
import { cartItemsAtom } from '@/store/itemsStore';
import { PrevButton } from '@/components/button/ButtonComponents';
import { IoStarSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import Image from "next/image";
import Script from 'next/script';
import { toast, Slide, Bounce } from 'react-toastify';
import { notiAtom } from '@/store/notiState';

export default function page() {
    const setProgress = useSetRecoilState(progressAtom);
    const cartItems = useRecoilValue(cartItemsAtom);

    useEffect(() => {
        setProgress(false);
        // console.log("cartItems from order-summary page", cartItems);
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
                    <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{data.item.total_review != 0 ? data.item.rating.toPrecision(2)  : "Unrated"}</span> <IoStarSharp />  </button>
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
    const cartsItems = useRecoilValue(cartItemsAtom);
    const [processing, setProcessing] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [cooking_instruction, setCookingInstruction] = useState("");
    const setNoti = useSetRecoilState(notiAtom);

    async function makePaymentHandler() {
        try {
            setProcessing(true);
            let res = await fetch("/api/payment/create-order", {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items: cartsItems, cooking_instruction })
            });
            res = await res.json();
            setProcessing(false);
            if (!res.ok) {
                if (res.type == "Info") {
                    setNoti({ show: true, message: res.message, type: res.type });
                }
                else {
                    toast.error(res.message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    });
                }
                return;
            }
            //all ok, create the payment checkout
            let options = {
                "key": res.key, // Enter the Key ID generated from the Dashboard
                "amount": res.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": res.order.currency,
                "name": "Hungry Harbor", //your business name
                "description": "Test Transaction",
                "order_id": res.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response) {
                    toast.success("Payment successfull.", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    });
                },
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": res.user.name, //your customer's name
                    "email": res.user.email,
                    "contact": res.user.phone //Provide the customer's phone number for better conversion rates 
                },
                config: {
                    display: {
                        blocks: {
                            banks: {
                                name: 'All payment methods',
                                instruments: [
                                    {
                                        method: 'upi'
                                    },
                                    {
                                        method: 'card'
                                    },
                                    {
                                        method: 'wallet'
                                    },
                                    {
                                        method: 'netbanking'
                                    }
                                ],
                            }
                        },
                        sequence: ['block.banks'],
                        preferences: {
                            show_default_blocks: false,
                        }
                    },
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            let rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error("Payment Failed", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            });
            rzp1.open();
        }
        catch (err) {
            setProcessing(false);
            toast.error(err.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
    }

    return (
        <Fragment>
            <div className="sticky bottom-2 p-1  bg-slate-200  flex flex-col gap-2 shadow-sm shadow-slate-600">
                <div className='p-2 '>
                    <textarea name="" id="" cols="30" rows="4" className='rounded-md border border-blue-900 h-full w-full' placeholder='Any the cooking instruction'
                        value={cooking_instruction}
                        onChange={e => { e.stopPropagation(), setCookingInstruction(e.target.value);}}
                    ></textarea>
                </div>
                <div className=" flex justify-between items-center ">
                    <span>Price ( {cart_summary.total_item} Items )</span>
                    <span className="flex gap-1 items-center text-lg font-bold"><FaRupeeSign /> {cart_summary.total_price} </span>
                </div>
                <div className=" flex justify-between items-center">
                    <span>Out of stock</span>
                    <span> {cart_summary.out_of_stock} </span>
                </div>
                <button className={`px-2 py-1 rounded-sm bg-blue-700 hover:bg-blue-600 text-white font-bold `} disabled={isDisabled} onClick={e => { e.stopPropagation(); makePaymentHandler(); }} >
                    {
                        processing ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <span>Make Payment</span>
                        )
                    }
                </button>
                <Script src="https://checkout.razorpay.com/v1/checkout.js" onReady={() => { setIsDisabled(false) }} />
            </div>
        </Fragment>
    )
}