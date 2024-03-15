"use client";
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';
import { toast, Slide, Bounce } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { progressAtom } from '@/store/progressAtom';

export function NotificationsWindow() {
    const [hasNext, setHasNext] = useState(true);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [pageNo, setPageNo] = useState(0);
    const [notifications, setNotifications] = useState([]);
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
        return !hasNext || index < notifications.length;
    }

    function fetchMorePage({ startIndex, stopIndex }) {
        setIsLoadingNextPage(true);
        fetch(`/api/notification/get-notification`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ page_no: pageNo, row_per_page: 20 })
        })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    setPageNo(pageNo => pageNo + 1);
                    setIsLoadingNextPage(false);
                    cache.current.clear(notifications.length, 0);
                    setNotifications(prevNotifications => prevNotifications.concat(res.notifications));
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

    if (!hasNext && notifications.length == 0) {
        return <div className='p-1 text-xl font-bold text-blue-900'>No notifications found</div>
    }

    return (
        <div className='h-screen w-full '>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={isLoadingNextPage ? () => { } : fetchMorePage}
                rowCount={hasNext ? notifications.length + 1 : notifications.length}
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
                                rowCount={hasNext ? notifications.length + 1 : notifications.length}
                                rowRenderer={({ key, index, style, parent }) => { return <NotificationBox key={key} index={index} style={style} parent={parent} notifications={notifications} cache={cache} /> }}
                            >

                            </List>
                        }}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        </div>
    );
}


function NotificationBox({ index, style, parent, notifications, cache }) {
    const notification = notifications[index];
    const [isRead, setIsRead] = useState(!notification ? true : notification.is_read);
    const setProgress=useSetRecoilState(progressAtom);
    function markReadHandler(e){
        e.stopPropagation();
        setProgress(true);
        fetch("/api/notification/mark-read",{
            cache:"no-store",
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id:notification._id})
        })
        .then(res=>res.json())
        .then(res=>{
            setProgress(false);
            if(res.ok){
                setIsRead(true);
            }
            else{
                setIsRead(false);
            }
        })
        .catch(err=>{
            setProgress(false);
        });
    }
    return (
        <CellMeasurer
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            {
                index < notifications.length ? (
                    <div style={style} className='py-1'>
                        <div className={`${isRead ? "bg-slate-100" : "bg-slate-200"} p-1 rounded-sm shadow-sm shadow-slate-500 `} >
                            <p className={`font-semibold ${isRead ? "text-slate-800" : "text-blue-800"}`} > {notification.message} </p>
                            <div className='h-8 flex justify-between items-center'>
                                <span className='text-xs'> {new Date(notification.date).toLocaleString()} </span>
                                {
                                    !isRead &&
                                    <button className='px-1 py-0.5 rounded-md bg-blue-700 hover:bg-blue-600 text-white text-xs ' onClick={markReadHandler} >Mark Read</button>
                                }
                            </div>
                        </div>
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