"use client";

import React, { Fragment, useEffect, useState, useRef } from 'react';
import { userActiveOrderAtom } from '@/store/orderAtom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast, Slide, Bounce } from 'react-toastify';
import Image from 'next/image';
import { FaRupeeSign } from "react-icons/fa";
import ConfirmBox from '../confirm-box/ConfirmBox';
import { progressAtom } from '@/store/progressAtom';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';

export function UserOrder() {
    const [nav, setNav] = useState("cur");
    return (
        <div className='flex flex-col py-2 px-1 sm:px-2 gap-4'>
            <div className='h-10 flex justify-start items-center  shadow-sm shadow-slate-500'>
                <button className={`w-1/2 h-full bg-slate-200 hover:bg-slate-300 border-r border-blue-900 ${nav == "cur" ? "font-bold text-blue-600" : "text-slate-400"} `} onClick={e => { e.stopPropagation(); setNav("cur"); }} >Active order</button>
                <button className={`w-1/2 h-full bg-slate-200 hover:bg-slate-300 ${nav == "prev" ? "font-bold text-blue-600" : "text-slate-400"} `} onClick={e => { e.stopPropagation(); setNav("prev"); }} >Previous Order</button>
            </div>
            {
                nav == "cur" ? (
                    <CurOrder />
                ) : (
                    <PrevOrder />
                )
            }
        </div>
    );
}

function CurOrder() {
    const [activeOrders, setActiveOrders] = useRecoilState(userActiveOrderAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/order/get-user-active-order", {
            cache: "no-store",
            method: "GET"
        }).then(res => res.json())
            .then(res => {
                setLoading(false);
                if (res.ok) {
                    // console.log("setting active orders");
                    setActiveOrders(res.orders);
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
            })
            .catch(err => {
                setLoading(false);
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
    }, []);


    if (loading == true && activeOrders.length == 0) {
        return <p className='p-1 text-xl text-center font-bold text-blue-950 animate-pulse'>Loading...</p>
    }

    return (
        <div className='flex flex-col gap-1 justify-start items-center'>
            {
                activeOrders.length == 0 ? (
                    <div className='p-1 w-full text-center text-xl font-bold text-blue-950 '>No active orders</div>
                ) : (
                    activeOrders.map(order => {
                        return <ActiveOrder order={order} key={order._id} />
                    })
                )
            }
        </div>
    );
}


function ActiveOrder({ order }) {
    const [show, setShow] = useState(false);
    const setPregress = useSetRecoilState(progressAtom);

    function cancelOrdderHandler() {
        setPregress(true);
        setShow(false);
        fetch("/api/order/set/user-cancel-order", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: order._id })
        })
            .then(res => res.json())
            .then(res => {
                setPregress(false);
                if (res.ok) {
                    toast.success(res.message, {
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
            })
            .catch(err => {
                setPregress(false);
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

    function cancelHandler() {
        setShow(false);
    }

    return (
        <Fragment>
            <div className='p-0.5 bg-slate-100 w-full border border-slate-600 rounded-sm flex flex-col gap-1 justify-start md:flex-row'>
                <div className='p-0.5 flex flex-col gap-0.5 flex-wrap justify-start items-start md:w-1/2'>
                    {
                        order.items.map(data => {
                            return (
                                <div className='h-32 w-full flex items-center bg-slate-200 shadow-sm shadow-slate-500'>
                                    <Image className='h-full w-1/2' src={data.item.image} height={200} width={200} alt={`${data.item.name}-image`} ></Image>
                                    <div className='p-1 flex flex-col justify-start h-full'>
                                        <h1 className=' font-semibold text-lg'>{data.item.name} </h1>
                                        <span className='text-sm'>Quantity: {data.quantity}</span>
                                        <span className='text-sm'>Price: {data.quantity * data.item.price}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='p-1 flex flex-col bg-slate-200 justify-start items-start gap-1 md:w-1/2'>
                    <div > <span className='font-semibold'>Status :</span> <button className={`${order.status == 'pending' ? "bg-orange-500" : "bg-green-600"} py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > {order.status} </button> </div>
                    <button className={`bg-green-600 py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > {order.paid ? "Paid" : "Cash on Delivery"} </button>
                    <div>
                        <span className='font-bold'>Receipt id: </span>
                        <span className='font-semibold text-blue-800'>{order._id}</span>
                    </div>
                    {
                        order.orderId &&
                        <div>
                            <span className='font-bold'>Order id: </span>
                            <span className='font-semibold text-blue-800'>{order.orderId}</span>
                        </div>
                    }
                    {
                        order.paymentId &&
                        <div>
                            <span className='font-bold'>Payment id: </span>
                            <span className='font-semibold text-blue-800'>{order.paymentId}</span>
                        </div>
                    }
                    {
                        order.refunded &&
                        <button className={`bg-green-600 py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > Refunded </button>
                    }
                    {
                        order.refundId &&
                        <div>
                            <span className='font-bold'>Refund id: </span>
                            <span className='font-semibold text-blue-800'>{order.refundId}</span>
                        </div>
                    }
                    {order.cooking_inst_status == 'accepted' &&
                        (
                            <div>
                                <span className='font-semibold'> Cooding instruction :</span> <button className={`${order.cooking_inst_status == 'rejected' ? "bg-red-600" : "bg-green-600"} py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > {order.cooking_inst_status} </button>
                            </div>
                        )
                    }
                    <div className='flex gap-1'> <span className='font-semibold'>Total price :</span> <span className='flex justify-start items-center gap-1'> <FaRupeeSign /> {order.total_amount} </span> </div>
                    <div>
                        <span className='font-bold'>Order Time: </span>
                        <span className='font-semibold text-blue-800'>{new Date(order.date).toLocaleString()}</span>
                    </div>
                    {order.status == 'accepted' && <p className='text-green-800'>Will be ready in {order.ready_by} mins</p>}
                    <button className='px-1 py-0.5 bg-red-600 hover:bg-red-500 rounded-md text-white text-xs' onClick={e => { setShow(true) }} >Cancel Order</button>
                </div>
            </div>
            <ConfirmBox show={show} onYes={cancelOrdderHandler} onCancel={cancelHandler} text={"Cancel the order"} />
        </Fragment>
    );
}


function PrevOrder() {
    const [hasNext, setHasNext] = useState(true);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [orders, setOrders] = useState([]);
    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
    }));

    useEffect(() => {
        return () => {
            cache.current.clearAll();
        }
    }, []);

    function isRowLoaded({ index }) {
        return !hasNext || index < orders.length;
    }

    function fetchMorePage({ startIndex, stopIndex }) {
        setIsLoadingNextPage(true);
        fetch(`/api/order/get-user-prev-order`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ page_no: pageNo, row_per_page: 10 })
        })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    setPageNo(pageNo => pageNo + 1);
                    setIsLoadingNextPage(false);
                    cache.current.clear(orders.length, 0);
                    setOrders(prevOrders => prevOrders.concat(res.orders));
                    if (!res.hasNext) {
                        setHasNext(false);
                    }
                }
                else {
                    setHasNext(false);
                    setIsLoadingNextPage(false);
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
            })
            .catch(err => {
                setHasNext(false);
                setIsLoadingNextPage(false);
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
    }

    if (!hasNext && orders.length == 0) {
        return <div className='p-1 text-xl font-bold text-blue-900'>No previous order found</div>
    }

    return (
        <div className='h-screen w-full '>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={isLoadingNextPage ? () => { } : fetchMorePage}
                rowCount={hasNext ? orders.length + 1 : orders.length}
            >
                {({ onRowsRendered, registerChild }) => (
                    <AutoSizer >
                        {({ width, height }) => {
                            return <List
                                ref={registerChild}
                                onRowsRendered={onRowsRendered}
                                width={width}
                                height={height}
                                rowHeight={cache.current.rowHeight}
                                deferredMeasurementCache={cache.current}
                                rowCount={hasNext ? orders.length + 1 : orders.length}
                                rowRenderer={({ key, index, style, parent }) => { return <PrevOrderBox key={key} index={index} style={style} parent={parent} orders={orders} cache={cache} /> }}
                            >

                            </List>
                        }}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        </div>
    );
}

function PrevOrderBox({ index, style, parent, orders, cache }) {
    const order = orders[index];
    return (
        <CellMeasurer
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            {
                index < orders.length ? (
                    <div style={style} className='p-0.5 bg-slate-100 w-full border-2 border-slate-600 rounded-sm flex flex-col gap-1 justify-start md:flex-row'>
                        <div className='p-0.5 flex flex-col gap-0.5 flex-wrap justify-start items-start md:w-1/2'>
                            {
                                order.items.map(data => {
                                    return (
                                        <div className='h-32 w-full flex items-center bg-slate-200 shadow-sm shadow-slate-500'>
                                            <Image className='h-full w-1/2' src={data.item.image} height={200} width={200} alt={`${data.item.name}-image`} ></Image>
                                            <div className='p-1 flex flex-col justify-start h-full'>
                                                <h1 className=' font-semibold text-lg'>{data.item.name} </h1>
                                                <span className='text-sm'>Quantity: {data.quantity}</span>
                                                <span className='text-sm'>Price: {data.quantity * data.item.price}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='p-1 flex flex-col bg-slate-200 justify-start items-start gap-1 md:w-1/2'>
                            <div > <span className='font-semibold'>Status :</span> <button className={`${order.status == 'pending' ? "bg-orange-500" : "bg-green-600"} py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > {order.status} </button> </div>
                            <button className={`bg-green-600 py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > {order.paid ? "Paid" : "Cash on Delivery"} </button>
                            <div>
                                <span className='font-bold'>Receipt id: </span>
                                <span className='font-semibold text-blue-800'>{order._id}</span>
                            </div>
                            {
                                order.orderId &&
                                <div>
                                    <span className='font-bold'>Order id: </span>
                                    <span className='font-semibold text-blue-800'>{order.orderId}</span>
                                </div>
                            }
                            {
                                order.paymentId &&
                                <div>
                                    <span className='font-bold'>Payment id: </span>
                                    <span className='font-semibold text-blue-800'>{order.paymentId}</span>
                                </div>
                            }
                            {
                                order.refunded &&
                                <button className={`bg-green-600 py-0.5 px-1 rounded-md font-semibold text-white text-xs`} disabled={true} > Refunded </button>
                            }
                            {
                                order.refundId &&
                                <div>
                                    <span className='font-bold'>Refund id: </span>
                                    <span className='font-semibold text-blue-800'>{order.refundId}</span>
                                </div>
                            }
                            <div className='flex gap-1'> <span className='font-semibold'>Total price :</span> <span className='flex justify-start items-center gap-1'> <FaRupeeSign /> {order.total_amount} </span> </div>
                            <div>
                                <span className='font-bold'>Order Time: </span>
                                <span className='font-semibold text-blue-800'>{new Date(order.date).toLocaleString()}</span>
                            </div>
                            {order.status == 'accepted' && <p className='text-green-800'>Will be ready in {order.ready_by} mins</p>}
                        </div>
                    </div>
                ) : (
                    <div style={style} className=' bg-slate-50 border border-black'>
                        <p className='p-1 text-sm text-blue-900 font-bold animate-pulse'>Loading...</p>
                    </div>
                )
            }

        </CellMeasurer>
    )
}