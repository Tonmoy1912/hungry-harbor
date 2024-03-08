"use client";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

export function ReviewWindow() {
    const [comments, setComments] = useState([]);
    const cache = useRef(new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100,
    }));
    // console.log("cache",cache);
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(res => res.json())
            .then(res => { console.log(res); setComments([...res]); });
    },[]);
    return (
        <div className='mx-2 my-2 bg-slate-100 shadow-md shadow-slate-500 h-96 flex flex-col gap-2'>
            {/* <button onClick={FetchHandler} className='border-2 border-black'>Fetch</button> */}
            <AutoSizer >
                {({ width, height }) => {
                    return <List
                        width={width}
                        height={height}
                        rowHeight={cache.current.rowHeight}
                        deferredMeasurementCache={cache.current}
                        rowCount={comments.length}
                        // rowRenderer={({ key, index, style, parent, comments, cache })=>{return <ReviewBox key={key} index={index} style={style} parent={parent} comments={comments} cache={cache} />}}
                        rowRenderer={({ key, index, style, parent }) => (
                            <CellMeasurer
                                key={key}
                                cache={cache.current}
                                parent={parent}
                                columnIndex={0}
                                rowIndex={index}
                            >
                                <div style={style} className=' bg-blue-200 border border-black'>
                                    <h1 className='text-xl font-bold'>{comments[index].title}</h1>
                                    <p className='p-1 text-sm'>{comments[index].body}</p>
                                </div>
                            </CellMeasurer>
                        )}
                    >

                    </List>
                }}
            </AutoSizer>
        </div>
    );
}

export function ReviewBox({ key, index, style, parent, comments, cache }) {
    return (
        <CellMeasurer
            key={key}
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div style={style} className='m-1 bg-blue-200'>
                <h1 className='text-xl font-bold'>{comments[index].title}</h1>
                <p className='p-1 text-sm'>{comments[index].body}</p>
            </div>
        </CellMeasurer>
    );
}