import React from 'react'

export default function loading() {
    return (
        <div className='h-screen w-full  bg-blue-950 flex flex-col justify-start items-center'>
            {/* <h1 className='text-5xl text-white font-extrabold'>Loading...</h1> */}
            <div className="animate-pulse h-full w-full flex flex-col justify-center gap-6 p-10">
                <div className='h-4 w-1/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-2/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-3/4 rounded-full bg-blue-800 border-white'></div>

                <div className='h-4 w-1/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-2/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-3/4 rounded-full bg-blue-800 border-white'></div>

                <div className='h-4 w-1/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-2/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-3/4 rounded-full bg-blue-800 border-white'></div>

                <div className='h-4 w-1/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-2/4 rounded-full bg-blue-800 border-white'></div>
                <div className='h-4 w-3/4 rounded-full bg-blue-800 border-white'></div>

            </div>
        </div>
    )
}
