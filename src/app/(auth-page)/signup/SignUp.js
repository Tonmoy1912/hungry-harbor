"use client";
//completely done

import React, { Fragment, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Notification from '@/components/notification/Notification';

function isEmailValid(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Test the email against the regex
  return emailRegex.test(email);
}

export default function SignUp() {

  const [data, setData] = useState({ email: "", password: "", confirm_password: "", name: "" });
  const [isLoading, setLoading] = useState(false);
  const [notiData,setNotiData]=useState({show:false,message:"",type:""});

  function changeHandler(e) {
    setData({
      ...data, [e.target.name]: e.target.value
    });
  }

  function closeNoti(){
    setNotiData({show:false,message:"",type:""});
  }

  function clickHandler() {
    setLoading(true);
    for (let key in data) {
      if (data[key] == "") {
        // alert("All fields must be filled");
        setLoading(false);
        setNotiData({show:true,message:"All fields must be filled",type:"Message"});
        return;
      }
    }
    if (!isEmailValid(data.email)) {
      // alert("Enter a valid email");
      setLoading(false);
      setNotiData({show:true,message:"Enter a valid email",type:"Message"});
      return;
    }
    if (data.password != data.confirm_password) {
      // alert("Password doesn't match");
      setLoading(false);
      setNotiData({show:true,message:"Password doesn't match",type:"Message"});
      return;
    }
    
    //backend call for signup
    fetch("/api/auth/signup", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(data => data.json())
      .then(data => {
        setLoading(false);
        if (data.ok) {
          // console.log("SignUp successfull. Now login with email and password");
          setNotiData({show:true,message:"SignUp successfull. Now login with email and password",type:"Success"});
          setData({ email: "", password: "", confirm_password: "", name: "" });
        }
        else {
          // console.log(data.message);
          setNotiData({show:true,message:data.message,type:"Failed"});
        }
      })
      .catch((err)=>{setLoading(false)});
  }

  return (
    <Fragment>
    <div className="h-screen w-screen flex justify-center items-center bg-cover bg-center bg-[url('/images/login-sm2.jpg')] sm:bg-[url('/images/login-lg2.jpg')]  opacity-100">
      {/* <div className='min-h-96 min-w-72 sm:min-h-[430px] sm:w-[400px] p-6 backdrop-blur-2xl  sm:bg-cyan-900 backdrop-brightness-90 border-2  border-white rounded-lg shadow-sm shadow-slate-200'> */}
      <div className='min-h-96 min-w-72 sm:min-h-[430px] sm:w-[400px] p-6 backdrop-blur-2xl  sm:bg-gradient-to-b from-blue-900 to-cyan-900  backdrop-brightness-90 border-2  border-white rounded-lg shadow-sm shadow-slate-200'>
        <h1 className='text-center text-3xl font-extrabold text-white pb-6'>User Signup</h1>
        <div className=' flex flex-col p-3 gap-4'>
          <input className='p-1 rounded-md' type="text" name="name" value={data.name} placeholder='Name' onChange={changeHandler} />
          <input className='p-1 rounded-md' type="email" name="email" value={data.email} placeholder='Email' onChange={changeHandler} />
          <input className='p-1 rounded-md' type="password" name="password" value={data.password} placeholder='Password' onChange={changeHandler} />
          <input className='p-1 rounded-md' type="text" name="confirm_password" value={data.confirm_password} placeholder='Confirm password' onChange={changeHandler} />

          {isLoading ?
            (
              <button className='bg-blue-500 p-2 rounded-md text-white font-semibold animate-pulse' disabled>Processing...</button>
            ) :
            (<button className='bg-blue-500 p-2 rounded-md text-white font-semibold ' onClick={clickHandler}>Signup</button>)
          }
          {/* or seperator */}
          <div className='flex justify-between items-baseline'>
            <div className='w-1/3 h-0.5 bg-white'></div>
            <span className='text-white text-md'>or</span>
            <div className='w-1/3 h-0.5 bg-white'></div>
          </div>
          {/* other login options */}
          <button className='bg-green-800 p-2 rounded-md text-white font-semibold flex justify-center gap-2 items-center' onClick={() => { signIn("google") }}>Signup with Google <span><FcGoogle className='scale-125' /></span> </button>

          <button className='bg-blue-500 p-2 rounded-md text-white font-semibold '><Link href={"/login"}>Go to Login page</Link></button>
        </div>
      </div>
    </div>

    {/* Notification................ */}
      <Notification message={notiData.message} type={notiData.type}  onClick={closeNoti} show={notiData.show}/>
    </Fragment>
  );
}

