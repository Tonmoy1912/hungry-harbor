"use client";
import React,{Fragment, useEffect,useState} from 'react';
import { CloseShop, OpenShop, getOpeningTime } from './shop-open-close-server-component';

export function ClosedTopBar() {
    const [data,setData]=useState(null);

    async function SetOpeningTime(){
        const res=await getOpeningTime();
        setData(res);
        // console.log("res",res);
    }

    useEffect(()=>{
       SetOpeningTime();
    },[]);

    if(data==null){
        return null;
    }
  return (
    <p className='w-full bg-green-500 text-white text-center p-2 text-sm '>
      The shop is currently closed. So, you can't make any order now.
    </p>
  )
}

export function OpenButton({setData}){
    function clickHandler(){
        OpenShop()
        .then(res=>{
            if(res){
                setData(null);
            }
        })
        .catch(err=>{});
    }
    return (
        <button className='px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-md' onClick={clickHandler} >Open Shop</button>
    )
}

export function CloseButton({setData}){
    function clickHandler(){
        CloseShop()
        .then(res=>{
            if(res){
                setData({});
            }
        })
        .catch(err=>{});
    }
    return (
        <button className='px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-md' onClick={clickHandler} >Close Shop</button>
    )
}

export function OpenCloseButton(){
    const [data,setData]=useState(null);

    async function SetOpeningTime(){
        const res=await getOpeningTime();
        setData(res);
        console.log("res",res);
    }

    useEffect(()=>{
       SetOpeningTime();
    },[]);

    if(data==null){
        return <CloseButton setData={setData} />
    }
    return <OpenButton setData={setData} />
}