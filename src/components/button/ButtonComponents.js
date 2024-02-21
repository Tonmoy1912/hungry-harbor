"use client";
import React,{Fragment} from 'react';
import { useRouter } from 'next/navigation';
import { GrLinkPrevious } from "react-icons/gr";

export function PrevButton() {
    const router=useRouter();
  return (
        <button className='py-1 px-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-800' onClick={()=>{router.back()}}><GrLinkPrevious/> Prev</button>
  )
}
