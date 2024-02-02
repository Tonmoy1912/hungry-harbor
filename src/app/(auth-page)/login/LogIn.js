"use client";
//almost done, only notification need to be added

import React, { Fragment, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Notification from '@/components/notification.js/Notification';

function isEmailValid(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Test the email against the regex
  return emailRegex.test(email);
}

export default function LogIn() {

  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setLoading] = useState(false);
  const [notiData, setNotiData] = useState({ show: false, message: "", type: "" });
  const router = useRouter();

  function closeNoti() {
    setNotiData({ show: false, message: "", type: "" });
  }

  function changeHandler(e) {
    setData({
      ...data, [e.target.name]: e.target.value
    });
  }

  async function clickHandler() {
    setLoading(true);
    for (let key in data) {
      if (data[key] == "") {
        // alert("All fields must be filled");
        setLoading(false);
        setNotiData({ show: true, message: "All fields must be filled", type: "Message" });
        return;
      }
    }
    if (!isEmailValid(data.email)) {
      // alert("Enter a valid email");
      setLoading(false);
      setNotiData({show:true,message:"Enter a valid email",type:"Message"});
      return;
    }
    
    const result = await signIn("credentials", { redirect: false, email: data.email, password: data.password });
    setLoading(false);
    if (result.ok) {
      router.refresh();
      // router.push("/");
      // console.log("login successfull");
    }
    else {
      // console.log("Enter valid credentials");
      setNotiData({show:true,message:"Enter valid credentials",type:"Failed"});
    }
  }

  return (
    <Fragment>
      <div className="h-screen w-screen flex justify-center items-center bg-cover bg-center bg-[url('/images/login-sm2.jpg')] sm:bg-[url('/images/login-lg2.jpg')] opacity-100">
        {/* <div className='min-h-96 min-w-72 sm:min-h-[430px] sm:w-[400px] p-6 backdrop-blur-2xl sm:bg-cyan-900  backdrop-brightness-90 border-2  border-white rounded-lg shadow-sm shadow-slate-200'> */}
        <div className='min-h-96 min-w-72 sm:min-h-[430px] sm:w-[400px] p-6 backdrop-blur-2xl  sm:bg-gradient-to-b from-blue-900 to-cyan-900  backdrop-brightness-90 border-2  border-white rounded-lg shadow-sm shadow-slate-200'>
          <h1 className='text-center text-3xl font-extrabold text-white pb-8'>User Login</h1>
          <div className=' flex flex-col p-4 gap-6'>
            <input className='p-1 rounded-md' type="email" name="email" value={data.email} placeholder='Email' onChange={changeHandler} />
            <input className='p-1 rounded-md' type="password" name="password" value={data.password} placeholder='Password' onChange={changeHandler} />

            {isLoading ?
              (
                <button className='bg-blue-500 p-2 rounded-md text-white font-semibold animate-pulse' disabled>Processing...</button>
              ) :
              (<button className='bg-blue-500 p-2 rounded-md text-white font-semibold ' onClick={clickHandler}>Login</button>)
            }

            {/* or seperator */}
            <Link href={"/forgot-password"} className='text-sm text-slate-50 self-end underline -my-3'>Forgot Password</Link>
            <div className='flex justify-between items-baseline'>
              <div className='w-1/3 h-0.5 bg-white'></div>
              <span className='text-white text-md'>or</span>
              <div className='w-1/3 h-0.5 bg-white'></div>
            </div>
            {/* other login options */}
            <button className='bg-green-800 p-2 rounded-md text-white font-semibold flex justify-center gap-2 items-center' onClick={() => { signIn("google") }}>Login with Google <span><FcGoogle className='scale-125' /></span> </button>

            <button className='bg-blue-500 p-2 rounded-md text-white font-semibold '><Link href={"/signup"}>Go to Signup page</Link></button>
          </div>
        </div>
      </div>

      {/* Notification................ */}
        <Notification message={notiData.message} type={notiData.type} onClick={closeNoti} show={notiData.show}/>
    </Fragment>
  );
}


