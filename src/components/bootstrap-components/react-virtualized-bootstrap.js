"use client";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';

export function BootstrapReviewWindow() {
    const [comments, setComments] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
    }));
    // console.log("cache",cache);
    // useEffect(() => {
    //     fetch("https://jsonplaceholder.typicode.com/posts/1/comments")
    //         .then(res => res.json())
    //         .then(res => { console.log(res); setComments([...res]); cache.current.clear(comments.length, 0); });
    // }, []);



    function deleteFirstFive() {
        setComments(comments.slice(1));
        cache.current.clearAll();
    }

    function isRowLoaded({ index }) {
        return !hasNext || index < comments.length;
    }

    function fetchMorePage({ startIndex, stopIndex }) {
        setIsLoadingNextPage(true);
        fetch(`https://jsonplaceholder.typicode.com/posts/${pageNo}/comments`)
            .then(res => res.json())
            .then(res => {
                setPageNo(pageNo => pageNo + 1);
                setIsLoadingNextPage(false);
                cache.current.clear(comments.length, 0);
                setComments(prevComments => prevComments.concat(res));
            })
    }

    useEffect(() => {
        if (pageNo >= 10) {
            setHasNext(false);
        }
    }, [pageNo]);

    return (
        <div className='mx-2 my-2 bg-slate-100 shadow-md shadow-slate-500 h-96 flex flex-col gap-2'>
            {/* <button onClick={deleteFirstFive} className='border-2 border-black'>Delete</button> */}
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={isLoadingNextPage ? () => { } : fetchMorePage}
                rowCount={hasNext ? comments.length + 1 : comments.length}
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
                                rowCount={hasNext ? comments.length + 1 : comments.length}
                                rowRenderer={({ key, index, style, parent }) => { return <BootstrapReviewBox key={key} index={index} style={style} parent={parent} comments={comments} cache={cache} /> }}
                            >

                            </List>
                        }}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        </div>
    );
}

export function BootstrapReviewBox({ index, style, parent, comments, cache }) {
    return (
        <CellMeasurer
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            {
                index < comments.length ? (
                    <div style={style} className=' bg-blue-200 border border-black'>
                        <h1 className='text-xl font-bold'>{comments[index].postId}</h1>
                        <p className='p-1 text-sm'>{comments[index].body}</p>
                    </div>
                ) : (
                    <div style={style} className=' bg-blue-200 border border-black'>
                        <p className='p-1 text-sm bg-slate-200 text-blue-900 font-bold animate-pulse'>Loading...</p>
                    </div>
                )
            }

        </CellMeasurer>
    );
}