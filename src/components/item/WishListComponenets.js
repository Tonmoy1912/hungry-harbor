"use client";
import React, { Fragment, useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { TbJewishStar } from "react-icons/tb";
import { TbJewishStarFilled } from "react-icons/tb";
import Image from "next/image";
import { allItemsAtom } from "@/store/itemsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Slide, Bounce } from "react-toastify";
import { progressAtom } from "@/store/progressAtom";
import { wishListItemsAtom } from "@/store/itemsStore";
import ConfirmBox from "../confirm-box/ConfirmBox";
import { useRouter } from "next/navigation";


export function WishListWindow() {
    const [wishListItems, setWishlistItems] = useRecoilState(wishListItemsAtom);
    const { data: items, isLoading } = useQuery({
        queryKey: ["wishlist-itmes"],
        queryFn: async function () {
            try {
                let res = await fetch("/api/wishlist/get-wishlist-items", {
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
        if (!isLoading) {
            setWishlistItems(items);
        }
    }, [isLoading, items]);

    if (isLoading) {
        return (
            <h1 className="text-2xl font-bold text-blue-900 animate-pulse py-6">
                Loading...
            </h1>
        )
    }

    return (
        <Fragment>
            <div className="py-6 px-0.5 md:px-4  gap-10  flex flex-wrap justify-center md:justify-start items-center mx-auto ">
                {
                    wishListItems.length == 0 ? (
                        <h1 className="text-2xl font-bold text-blue-900 ">
                            No item found
                        </h1>
                    ) : (
                        wishListItems.map(item => {
                            return <WishlistItemCart item={item} key={item.name} />;
                        })
                    )
                }
            </div>
        </Fragment>
    )
}


export function WishlistItemCart({ item }) {
    const setProgress = useSetRecoilState(progressAtom);
    const queryClient = useQueryClient();
    const setWishListItems = useSetRecoilState(wishListItemsAtom);
    const [showConfirmBox,setShowConfirmBox]=useState(false);
    const [processing,setProcessing]=useState(false);
    const router=useRouter();

    function unsetInWish(item_id) {
        queryClient.invalidateQueries({ queryKey: ["all-items"] })
        setWishListItems(items => {
            return items.filter(item => item._id != item_id);
        });
    }


    function removeFromWishlist(item_id) {
        setProgress(true);
        fetch("/api/wishlist/remove-from-wishlist", {
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
                    unsetInWish(item_id);
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

    function addToCart(item_id) {
        setProgress(true);
        setProcessing(true);
        fetch("/api/cart/add-to-cart", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ item_id })
        }).then(res => res.json())
            .then(data => {
                setProgress(false);
                setProcessing(false);
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
        <Fragment>
            <div className="border border-blue-900 p-2 min-h-72 w-96 flex flex-col gap-2 items-start bg-slate-200 rounded-md shadow-md shadow-slate-700 hover:scale-105  ease-in duration-300 cursor-pointer" onClick={()=>{setProgress(true);router.push(`/items/${item._id}`);}}>
                <div className="w-full h-60  ">
                    <Image src={item.image} alt={`${item.name}-image`} height={400} width={400} className="h-full w-full rounded-md" />
                </div>
                <div className=" w-full flex justify-between items-center">
                    <h1 className="text-xl font-bold ">{item.name}</h1>
                    <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{item.total_review != 0 ? item.rating : "Unrated"}</span> <IoStarSharp />  </button>
                </div>
                <div className=" w-full flex justify-between items-center">
                    <div className="flex flex-col gap-2 items-start">
                        <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold' disabled={true}>{item.category}</button>
                        <button className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex gap-1 items-center ' disabled={true}> <MdOutlineRateReview className='scale-125' />  <span>{item.total_review}</span></button>
                    </div>
                    <button className='px-1.5  rounded-lg  text-black text-xs font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{item.price}</span></button>
                </div>
                <button className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex flex-col items-start md:flex-row gap-1 md:items-center ' > <span> In Stock: {item.in_stock != 0 ? (item.in_stock) : (
                    <button className='px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-semibold' disabled={true}>Out of Stock </button>
                )}</span>
                </button>
                <div className="pt-2 w-full px-2 text-white font-semibold border-t-2 border-black flex justify-end items-center gap-3">
                    <button><TbJewishStarFilled className="text-blue-700 scale-125" onClick={e => { e.stopPropagation(); setShowConfirmBox(true); }} /> </button>
                    <button className="py-1 px-2 rounded-md bg-blue-800 hover:bg-blue-700 ">Buy Now</button>
                    {
                        processing?(
                            <button className="py-1 px-2 rounded-md bg-blue-700 animate-pulse">Processing...</button>
                        ):(
                            <button className="py-1 px-2 rounded-md bg-blue-700 hover:bg-blue-600 flex items-center gap-1" onClick={e=>{e.stopPropagation(); addToCart(item._id);}} >Add to Cart<FaCartPlus /> </button>
                        )
                    }
                </div>
            </div>
            <ConfirmBox show={showConfirmBox} onYes={()=>{removeFromWishlist(item._id);setShowConfirmBox(false);}} onCancel={()=>{setShowConfirmBox(false)}} text={"Remove from wishlist"} />
        </Fragment>
    )
}