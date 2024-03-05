"use client";
import React, { Fragment, useState, useEffect } from "react";
import { categoryAtom, selectedCategoryAtom } from "@/store/categoryAtom";
import { searchAtom } from "@/store/itemsStore";
import { useRecoilState, useSetRecoilState, useRecoilValueLoadable, useRecoilValue } from "recoil";
import { FaSearch } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { TbJewishStar } from "react-icons/tb";
import { TbJewishStarFilled } from "react-icons/tb";
import Image from "next/image";
import { notiAtom } from "@/store/notiState";
import { allItemsAtom, filteredItemsSelector } from "@/store/itemsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Slide, Bounce } from "react-toastify";
import { progressAtom } from "@/store/progressAtom";
import { wishListItemsAtom } from "@/store/itemsStore";

let item_obj = {
    _id: "65d231a92a0184bdff61f9f5",
    name: "Iron man",
    image: "https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/items%2Fwallpapertip_iron-man-hd-wallpapers_33193.jpg5ba477e2-3af1-48b8-9abb-a8857d8af8fe?alt=media&token=3477bde2-5dd5-493e-8bfb-bc58c5278b68",
    description: "highest rating 2030\nknight",
    price: 5000,
    category: "NON-VEG",
    removed: false,
    category_order: 2,
    global_order: 1,
    in_stock: 0,
    total_review: 0,
    rating: 0
};

// let item_obj=JSON.parse(item_json);

export function FilterBar() {
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
            <div className=' top-14 z-20 bg-blue-500 text-white shadow-md shadow-blue-500 border border-blue-900 w-11/12 mx-auto mt-2 p-2 flex flex-col gap-3 items-center  md:flex-row md:justify-between md:items-center rounded-md mb-0.5'>
                <select className='bg-transparent text-center text-sm md:text-md border-2 border-blue-700 rounded-md w-48 p-0.5  font-bold order-2 md:order-1' value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value) }} >
                    {
                        categoriesState.state != "hasValue" ?
                            (<option className='bg-blue-300' key={"loading"}>"loading..."</option>) :
                            categoriesState.contents.map(x => {
                                return (<option value={x.category} key={x.category} className='bg-blue-300'>{`${x.category} (${x.total})`}</option>)
                            })
                    }
                </select>
                <div className='flex items-center gap-2 order-1 md:order-2'>
                    <FaSearch className=' scale-110' />
                    <input type="search" className='p-0.5 md:p-1 text-blue-800 w-64 rounded-lg border border-white bg-blue-50 shadow-inner shadow-blue-500 ' placeholder='Search by name' value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
        </Fragment>
    );
}


export function ItemWindow() {
    const setNoti = useSetRecoilState(notiAtom);
    const setAllItems = useSetRecoilState(allItemsAtom);
    const filteredItems = useRecoilValue(filteredItemsSelector);
    const queryClient=useQueryClient();
    const { data: items, isLoading } = useQuery({
        queryKey: ["all-items"],
        // staleTime:30000,//30s
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
            <div className=" px-0.5 md:px-4 w-11/12 py-8 gap-10  flex flex-wrap justify-center md:justify-start items-center mx-auto ">
                {
                    isLoading ? (
                        <h1 className='bg-slate-200 w-full'>
                            <span className='text-blue-950 text-2xl font-bold animate-pulse py-1 px-2'>Loading...</span>
                        </h1>
                    ) : (
                        filteredItems.length == 0 ? (
                            <h1 className='bg-slate-200 w-full'>
                                <span className='text-blue-950 text-2xl font-bold py-1 px-2'>No Item found</span>
                            </h1>
                        ) : (
                            filteredItems.map(item => (<ItemCart item={item} key={item.name}/>))
                        )
                    )
                }
            </div>
        </Fragment>
    )
}

function TestComponent() {
    return (
        <Fragment>
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
            <ItemCart item={item_obj} />
        </Fragment>
    )
}




export function ItemCart({ item }) {
    const setProgress = useSetRecoilState(progressAtom);
    const setAllItems = useSetRecoilState(allItemsAtom);
    const [processing,setProcessing]=useState(false);
    const queryClient=useQueryClient();

    function setInWish(item_id) {
        setAllItems(itemList => {
            return itemList.map(x => {
                if (x._id == item_id) {
                    return { ...x, in_wishlist: true }
                }
                else {
                    return x;
                }
            })
        });
        queryClient.invalidateQueries({queryKey: ["wishlist-itmes"]});
    }

    function unsetInWish(item_id) {
        setAllItems(itemList => {
            return itemList.map(x => {
                if (x._id == item_id) {
                    return { ...x, in_wishlist: false }
                }
                else {
                    return x;
                }
            })
        });
        queryClient.invalidateQueries({queryKey: ["wishlist-itmes"]});
    }

    function addToWishlist(item_id) {
        setProgress(true);
        fetch("/api/wishlist/add-to-wishlist", {
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
                    setInWish(item_id)
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
            })
        return null;
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
            <div className="border border-blue-900 p-2 min-h-72 w-96 flex flex-col gap-2 items-start bg-slate-200 rounded-md shadow-md shadow-slate-700 hover:scale-105  ease-in duration-300">
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
                    {
                        item.in_wishlist ? (
                            <button><TbJewishStarFilled className="text-blue-700 scale-125" onClick={e => { e.stopPropagation(); removeFromWishlist(item._id) }} /> </button>
                        ) : (
                            <button><TbJewishStar className="text-blue-700 scale-125" onClick={e => { e.stopPropagation(); addToWishlist(item._id) }} /></button>
                        )
                    }

                    <button className="py-1 px-2 rounded-md bg-blue-800 hover:bg-blue-700 ">Buy Now</button>
                    {
                        processing?(
                            <button className="py-1 px-2 rounded-md bg-blue-700 animate-pulse">Processing...</button>
                        ):(
                            <button className={`py-1 px-2 rounded-md bg-blue-700 hover:bg-blue-600 flex items-center gap-1 `} onClick={e=>{e.stopPropagation(); addToCart(item._id);}} >Add to Cart<FaCartPlus /> </button>
                        )
                    }
                </div>
            </div>
        </Fragment>
    )
}