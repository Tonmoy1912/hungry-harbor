"use client";

import React, { Fragment, useEffect, useState } from "react";
import { IoStarSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import Image from "next/image";
import { toast, Slide, Bounce } from "react-toastify";
import { progressAtom } from "@/store/progressAtom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { cartItemsAtom, cartSummarySelector } from "@/store/itemsStore";
import { useRouter } from "next/navigation";
import Notification from "../notification/Notification";
import { notiAtom } from "@/store/notiState";


export function CartWindow() {
    const [items,setItems]=useRecoilState(cartItemsAtom);
    const setProgress = useSetRecoilState(progressAtom);

    const { data, isLoading: loading } = useQuery({
        queryKey: ["cartitems"],
        queryFn: async function () {
            try {
                let res = await fetch("/api/cart/get-cart-items", {
                    cache: "no-store",
                    method: "GET"
                });
                res = await res.json();
                if (res.ok) {
                    return res.items.reverse();
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
                    return [];
                }
            }
            catch (err) {
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
                return [];
            }
        }
    });
    useEffect(() => {
        if (!loading) {
            setItems(data);
        }
    }, [loading, data]);

    useEffect(()=>{
        setProgress(false);
    },[]);

    
    if (loading) {
        return (
            <h1 className="text-2xl font-bold text-blue-900 animate-pulse py-6">
                Loading...
            </h1>
        )
    }


    return (
        <div className="relative p-3 flex flex-col gap-2">
            {
                items.length == 0 ? (
                    <h1 className="text-2xl font-bold text-blue-900 ">
                        No items found
                    </h1>
                ) : (
                    items.map(item => <CartItem data={item} key={item.item._id} setItems={setItems} />)
                )
            }
            <CartSummary />
        </div>
    )
}

export function CartItem({ data, setItems }) {
    const [price,setPrice]=useState(data.item.price);
    const setProgress = useSetRecoilState(progressAtom);
    const router=useRouter();
    function IncrementCount(item_id) {
        setPrice(prev=>prev+data.item.price);
        setItems(items=>{
            return items.map(data=>{
                if(data.item._id==item_id){
                    return {...data,quantity:data.quantity+1};
                }
                else{
                    return data;
                }
            });
        });
    }
    function DecrementCount(item_id) {
        setPrice(prev=>prev-data.item.price);
        setItems(items=>{
            return items.map(data=>{
                if(data.item._id==item_id){
                    return {...data,quantity:data.quantity-1};
                }
                else{
                    return data;
                }
            });
        });
    }

    function removeFromLocalState(item_id) {
        setItems(items => {
            return items.filter(item => item.item._id != item_id)
        })
    }

    function removeFromCart(item_id) {
        setProgress(true);
        fetch("/api/cart/remove-from-cart", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ item_id })
        }).then(res => res.json())
            .then(data => {
                setProgress(false);
                if (data.ok) {
                    toast.success(data.message, {
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
                    removeFromLocalState(item_id);
                }
                else {
                    toast.error(data.message, {
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
            })
            .catch((err) => {
                setProgress(false);
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
            });
    }

    return (
        <Fragment>
            <div className='relative pb-2 md:pb-0 md:h-48 bg-slate-200 my-0.5 flex  flex-col md:flex-row rounded-sm shadow-sm shadow-slate-600'>
                <div className='w-full h-48 md:w-1/3  md:h-full p-1'>
                    <Image src={data.item.image} height={400} width={400} alt={`${data.item.name}'s image`} className='h-full w-full rounded-md border border-blue-800' ></Image>
                </div>
                <div className='w-full md:w-2/3 md:h-full p-1.5 flex flex-col justify-start gap-1.5 items-start pl-4'>
                    <h1 className='text-xl text-black font-bold'>{data.item.name}</h1>
                    <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold' disabled={true}>{data.item.category}</button>
                    <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{data.item.total_review != 0 ? data.item.rating : "Unrated"}</span> <IoStarSharp />  </button>
                    <button className='px-1.5  rounded-lg  text-black text-xs font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{price}</span></button>
                    <div className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> In Stock: {data.item.in_stock != 0 ? (data.item.in_stock) : (
                        <button className='px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-semibold' disabled={true}>Out of Stock </button>
                    )}</span> </div>
                </div>
                <div className='relative mt-4  md:absolute bottom-2 right-2 flex gap-3 items-center justify-self-end md:mt-4  px-2 text-sm self-end'>
                    <button className='px-2 py-1.5 rounded-md bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold flex gap-1 items-center ' onClick={(e)=>{e.stopPropagation();setProgress(true);router.push(`/items/${data.item._id}`);}}> View </button>
                    <button className='px-2 py-1.5 rounded-md bg-red-700 hover:bg-red-600 text-white text-xs font-semibold flex gap-1 items-center' onClick={e => { e.stopPropagation(); removeFromCart(data.item._id); }}  > Remove </button>
                    {
                        data.item.in_stock > 0 && (
                            <div className='overflow-clip rounded-md  text-white text-xs font-semibold flex items-center'  >
                                <button className={`py-1.5 border-r px-3 ${data.quantity <= 1 ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}  `} disabled={data.quantity <= 1} onClick={(e) => { e.stopPropagation(); DecrementCount(data.item._id); }} >-</button>
                                <div className="py-1.5 px-3 bg-blue-600 ">{data.quantity}</div>
                                <button className={`py-1.5 border-l px-3 ${data.quantity >= data.item.in_stock ? "bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"} `} disabled={data.quantity >= data.item.in_stock} onClick={(e) => { e.stopPropagation(); IncrementCount(data.item._id); }} >+</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </Fragment>
    );
}

export function CartSummary(){
    const cart_summary=useRecoilValue(cartSummarySelector);
    const cartsItems=useRecoilValue(cartItemsAtom);
    const [processing,setProcessing]=useState(false);
    const setProgress=useSetRecoilState(progressAtom);
    const setNoti=useSetRecoilState(notiAtom);
    const router=useRouter();

    function placeOrderHandler(){
        setProcessing(true);
        fetch("api/cart/validate-stock",{
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items:cartsItems })
        }).then(res=>res.json())
        .then(res=>{
            setProcessing(false);
            if(res.ok){
                //redirect to order summary page
                setProgress(true);
                router.push("/orders/order-summary");
            }
            else{
                if(res.type=="Info"){
                    setNoti({show:true,message:res.message,type:res.type});
                }
                else{
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
            }
        })
        .catch((err)=>{
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
        });
    }
    return (
        <div className="sticky bottom-2 p-1  bg-slate-200  flex flex-col gap-2 shadow-sm shadow-slate-600">
            <div className=" flex justify-between items-center ">
                <span>Price ( {cart_summary.total_item} Items )</span>
                <span className="flex gap-1 items-center text-lg font-bold"><FaRupeeSign  /> {cart_summary.total_price} </span>
            </div>
            <div className=" flex justify-between items-center">
                <span>Out of stock</span>
                <span> {cart_summary.out_of_stock} </span>
            </div>
            <button className={`px-2 py-1 rounded-sm bg-blue-700 hover:bg-blue-600 text-white font-bold `} onClick={e=>{e.stopPropagation();placeOrderHandler();}}>
                {
                    processing?(
                        <span className="animate-pulse">Processing...</span>
                    ):(
                        <span>Place order</span>
                    )
                }
            </button>
        </div>
    )
}