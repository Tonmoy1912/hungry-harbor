"use client";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';
import { IoMdAdd } from "react-icons/io";
import { progressAtom } from '@/store/progressAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast, Slide, Bounce } from 'react-toastify';
import { IoStarSharp } from "react-icons/io5";
import { sessionAtom } from '@/store/sessionStore';
import ConfirmBox from '../confirm-box/ConfirmBox';

export function ReviewWindow({ itemId, total_review }) {
    // console.log("itemId", itemId);
    const [show, setShow] = useState(false);
    const [reviews, setReviews] = useState([]);
    const session = useRecoilValue(sessionAtom);
    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
    }));
    useEffect(() => {
        return () => {
            cache.current.clearAll();
        }
    }, []);

    return (
        <div className=' mt-4  bg-slate-200  shadow-md shadow-slate-500 rounded-sm overflow-clip'>
            <div className='p-2 bg-blue-200 flex flex-row justify-between items-center'>
                <h1 className=' text-center font-bold text-xl'>Reviews</h1>
                {
                    session && <button className='px-1 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md flex items-center gap-1' onClick={e => { e.stopPropagation(), setShow(prev => !prev) }}><IoMdAdd /> Add Review </button>
                }
            </div>
            {show && <AddReview setShow={setShow} itemId={itemId} setReviews={setReviews} cache={cache} />}
            {
                total_review == 0 ? (
                    <div className='p-1 text-xl font-bold text-blue-900'>No Reviews</div>
                ) : (
                    <div className='p-1'>
                        <ReviewList itemId={itemId} reviews={reviews} setReviews={setReviews} cache={cache} />
                    </div>
                )
            }
        </div>
    )
}

function AddReview({ setShow, itemId, setReviews, cache }) {
    const [inputData, setInputData] = useState({ rating: "5", review: "" });
    const setProgress = useSetRecoilState(progressAtom);
    function handleChange(e) {
        setInputData(prev => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    }

    function submitHandler() {
        setProgress(true);
        fetch("/api/review/submit-review", {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, rating: inputData.rating, review: inputData.review })
        })
            .then(res => res.json())
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
                    setReviews(prev=>{
                        return [data.review,...prev];
                    });
                    cache.current.clearAll();
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
            .catch(err => {
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
    }

    return (
        <div className='p-2 flex flex-col gap-1 bg-slate-50 border border-blue-950'>
            <div className='flex justify-start items-center gap-2 text-2xl'>
                <span className='text-base font-semibold '>Rate out of 5 :</span>
                {
                    <RateInputComponent inputData={inputData} setInputData={setInputData} />
                }
            </div>
            <div>
                {/* <h1 className='text-base font-semibold'>Enter Your Review</h1> */}
                <textarea name="review" id="review" cols="30" rows="3" placeholder='Enter your review' className='p-0.5 text-sm h-20 w-full border border-slate-600 rounded-sm' onChange={handleChange}></textarea>
            </div>
            <div className='p-1 flex items-center gap-3'>
                <button className='px-1 py-0.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-sm' onClick={e => { e.stopPropagation(); setShow(false); submitHandler(); }}>Submit</button>
                <button className='px-1 py-0.5 border border-black rounded-md text-sm' onClick={e => { e.stopPropagation(); setShow(false); }}>Cancel</button>
            </div>
        </div>
    )
};

function RateInputComponent({ inputData, setInputData }) {
    return (
        <Fragment>
            <IoStarSharp className={`${inputData.rating >= 1 ? "text-green-600" : "text-slate-300"} cursor-pointer`} onClick={e => { e.stopPropagation(); setInputData((prev) => { return { ...prev, rating: 1 } }); }} />
            <IoStarSharp className={`${inputData.rating >= 2 ? "text-green-600" : "text-slate-300"} cursor-pointer`} onClick={e => { e.stopPropagation(); setInputData((prev) => { return { ...prev, rating: 2 } }); }} />
            <IoStarSharp className={`${inputData.rating >= 3 ? "text-green-600" : "text-slate-300"} cursor-pointer`} onClick={e => { e.stopPropagation(); setInputData((prev) => { return { ...prev, rating: 3 } }); }} />
            <IoStarSharp className={`${inputData.rating >= 4 ? "text-green-600" : "text-slate-300"} cursor-pointer`} onClick={e => { e.stopPropagation(); setInputData((prev) => { return { ...prev, rating: 4 } }); }} />
            <IoStarSharp className={`${inputData.rating >= 5 ? "text-green-600" : "text-slate-300"} cursor-pointer`} onClick={e => { e.stopPropagation(); setInputData((prev) => { return { ...prev, rating: 5 } }); }} />
        </Fragment>
    )
}

function ReviewList({ itemId, reviews, setReviews, cache }) {
    const [hasNext, setHasNext] = useState(true);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [confirmBox, setConfirmBox] = useState({ show: false, reviewId: null });
    

    const setProgress = useSetRecoilState(progressAtom);
    function onCancel(e) {
        e.stopPropagation();
        setConfirmBox({ show: false, reviewId: null });
    }
    function onYes(e) {
        // e.stopPropagation();
        setConfirmBox(prev => { return { ...prev, show: false } });
        setProgress(true);
        fetch(`/api/review/remove-review`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reviewId: confirmBox.reviewId })
        })
            .then(res => res.json())
            .then(res => {
                setProgress(false);
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
                    setReviews(prev => {
                        return prev.filter(x => {
                            return x._id != confirmBox.reviewId;
                        })
                    })
                    setConfirmBox({ show: false, reviewId: null });
                    cache.current.clearAll();
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
                    setConfirmBox({ show: false, reviewId: null });
                }
            })
            .catch(err => {
                setProgress(false);
                setConfirmBox({ show: false, reviewId: null });
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

    function isRowLoaded({ index }) {
        return !hasNext || index < reviews.length;
    }

    function fetchMorePage({ startIndex, stopIndex }) {
        setIsLoadingNextPage(true);
        fetch(`/api/review/get-all-review`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId: itemId, page_no: pageNo, row_per_page: 20 })
        })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    setPageNo(pageNo => pageNo + 1);
                    setIsLoadingNextPage(false);
                    cache.current.clear(reviews.length, 0);
                    setReviews(prevReviews => prevReviews.concat(res.reviews));
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


    return (
        <div className='h-96 bg-slate-100 rounded-md overflow-clip border border-blue-950'>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={isLoadingNextPage ? () => { } : fetchMorePage}
                rowCount={hasNext ? reviews.length + 1 : reviews.length}
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
                                rowCount={hasNext ? reviews.length + 1 : reviews.length}
                                rowRenderer={({ key, index, style, parent }) => { return <ReviewBox key={key} index={index} style={style} parent={parent} reviews={reviews} setConfirmBox={setConfirmBox} cache={cache} /> }}
                            >

                            </List>
                        }}
                    </AutoSizer>
                )}
            </InfiniteLoader>
            <ConfirmBox onYes={(e) => { e.stopPropagation(); onYes(); }} onCancel={onCancel} show={confirmBox.show} text="Remove the review" />
        </div>
    )
}

export function ReviewBox({ index, style, parent, reviews, cache, setConfirmBox }) {
    const session = useRecoilValue(sessionAtom);
    return (
        <CellMeasurer
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            {
                index < reviews.length ? (
                    <div style={style} className=' bg-slate-100 border border-black flex flex-col gap-1 p-1 items-start'>
                        <h1 className=' font-bold'>{reviews[index].user.name}</h1>
                        <div className='flex justify-start items-center gap-1 text-sm px-1'>
                            <RateComponent rating={reviews[index].rating} />
                        </div>
                        <p className='p-1 text-sm text-slate-900'>{reviews[index].review}</p>
                        {session && (session.id == reviews[index].user._id || session.isAdmin) &&
                            <button className='bg-red-700 hover:bg-red-600 px-1 py-0.5 text-xs rounded-md text-white' onClick={e => { e.stopPropagation(); setConfirmBox({ show: true, reviewId: reviews[index]._id }); }}>Delete</button>
                        }
                    </div>
                ) : (
                    <div style={style} className=' bg-slate-50 border border-black'>
                        <p className='p-1 text-sm text-blue-900 font-bold animate-pulse'>Loading...</p>
                    </div>
                )
            }

        </CellMeasurer>
    );
}

function RateComponent({ rating }) {
    return (
        <Fragment>
            <IoStarSharp className={`${rating >= 1 ? "text-green-600" : "text-slate-300"} cursor-pointer`} />
            <IoStarSharp className={`${rating >= 2 ? "text-green-600" : "text-slate-300"} cursor-pointer`} />
            <IoStarSharp className={`${rating >= 3 ? "text-green-600" : "text-slate-300"} cursor-pointer`} />
            <IoStarSharp className={`${rating >= 4 ? "text-green-600" : "text-slate-300"} cursor-pointer`} />
            <IoStarSharp className={`${rating >= 5 ? "text-green-600" : "text-slate-300"} cursor-pointer`} />
        </Fragment>
    )
}