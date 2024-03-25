"use client";
//completely done
import React, { Fragment, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { notiAtom } from '@/store/notiState';
import Link from 'next/link';
import { StopProgress } from '@/components/util/util';

export default function page() {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(true);
  const [sendAgain, setSendAgain] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [otpInput,setOTPInput]=useState(true);
  const setNoti=useSetRecoilState(notiAtom);
  function changeHandler(e) {
    setEmail(e.target.value);
  }
  function handleNoti() {
    setNoti({ message: "", type: "", show: false })
  }
  function sendOTPHandler() {
    if (email.trim() == "") {
      setNoti({ type: "Failed", message: "Enter valid input", show: true });
      return;
    }
    setProcessing(true);
    fetch("/api/forgot-password/get-otp", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
      .then(data => data.json())
      .then(data => {
        setProcessing(false);
        if (data.ok) {
          setSendAgain(true);
          setShowOTP(true);
          setOTPInput(true);
          setShowInput(false);
          setNoti({ type: "Success", message: data.message, show: true });
        }
        else {
          setNoti({ type: "Failed", message: data.message, show: true });
        }
      })
      .catch(err => {
        setProcessing(false);
        setNoti({ type: "Failed", message: err.message, show: true });
      })
  }
  return (
    <Fragment>
      <StopProgress/>
      <div className='h-screen w-screen bg-slate-50 flex justify-center items-center'>
        <div className='w-72 sm:w-96 p-5 min-h-96 bg-slate-100 border-2 border-black rounded-lg flex flex-col gap-6 justify-start items-center shadow-md shadow-slate-200'>
          <h1 className='text-2xl font-extrabold text-black text-center'>Forgot Password</h1>
          <div>
            <span className='text-black font-semibold mr-3 '>Email</span>
            <input type="email" className='p-0.5 border border-black' value={email} onChange={changeHandler} />
          </div>
          {
            processing ?
              <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg animate-pulse' disabled>Processing...</button>
              :
              <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg' onClick={sendOTPHandler}>Send OTP {sendAgain ? "Again" : ""} </button>
          }
          <div className='flex justify-center gap-3 '>
            <button className={`py-1 px-3 rounded-lg  border border-black text-sm font-semibold ${otpInput?"bg-black text-white":"bg-slate-50 text-black"}`} onClick={()=>{setOTPInput(true); setShowOTP(true); setShowInput(false);}}>OTP Input</button>
            <button className={`py-1 px-3 rounded-lg  border border-black text-sm font-semibold ${!otpInput?"bg-black text-white":"bg-slate-50 text-black"}`} onClick={()=>{setOTPInput(false); setShowOTP(false); setShowInput(true); }}>Change Password</button>
          </div>
          {showOTP && <OTPInput setShowInput={setShowInput} setShowOTP={setShowOTP} setNoti={setNoti} setOTPInput={setOTPInput}/>}
          {showInput && <PasswordInput setShowInput={setShowInput} setShowOTP={setShowOTP} setNoti={setNoti} setOTPInput={setOTPInput}/>}
          <Link href={"/login"} className='px-3 py-1 bg-black text-white rounded-lg' >Go to Login page</Link>
        </div>
      </div>
    </Fragment>
  )
}

function OTPInput({ setShowInput, setShowOTP, setNoti, setOTPInput }) {
  const [processing, setProcessing] = useState(false);
  const [otp, setOTP] = useState("");
  function submitHandler() {
    if (otp.trim() == "") {
      setNoti({ type: "Failed", message: "Enter valid input", show: true });
      return;
    }
    setProcessing(true);
    fetch("/api/forgot-password/verify-otp", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ otp: otp })
    })
      .then(data => data.json())
      .then(data => {
        setProcessing(false);
        if (data.ok) {
          setNoti({ type: "Success", message: data.message, show: true });
          setShowInput(true);
          setShowOTP(false);
          setOTPInput(false);
        }
        else {
          setNoti({ type: "Failed", message: data.message, show: true });
        }
      })
      .catch(err => {
        setProcessing(false);
        setNoti({ type: "Failed", message: err.message, show: true });
      })
  }
  return (
    <Fragment>
      <div className='w-10/12 border border-black'></div>
      <div>
        <span className='text-black font-semibold mr-3 '>Enter OTP</span>
        <br />
        <input type="text" className='p-0.5 border border-black' value={otp} onChange={(e) => { setOTP(e.target.value) }} />
      </div>
      {
        processing ?
          <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg animate-pulse' disabled>Processing...</button>
          :
          <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg' onClick={submitHandler}>Submit OTP</button>
      }
    </Fragment>
  )
}


function PasswordInput({ setShowInput, setShowOTP, setNoti, setOTPInput }) {
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState({ new_password: "", confirm_password: "" });
  function changeHandler(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  function setPasswordHandler() {
    // console.log("data", data);
    for (let i in data) {
      if (data[i].trim() == "") {
        setNoti({ type: "Failed", message: "Enter valid input", show: true });
        return;
      }
    }
    setProcessing(true);
    fetch("/api/forgot-password/reset-password", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(data => data.json())
      .then(data => {
        setProcessing(false);
        setNoti({ message: data.message, type: data.ok ? "Success" : "Failed", show: true });
      })
      .catch(err => {
        setProcessing(false);
        setNoti({ type: "Failed", message: err.message, show: true });
      })
  }
  return (
    <Fragment>
      <div className='w-10/12 border border-black'></div>
      <div>
        <span className='text-black font-semibold mr-3 '>New Password</span>
        <br />
        <input type="password" className='p-0.5 border border-black' name='new_password' value={data.new_password} onChange={changeHandler} />
      </div>
      <div>
        <span className='text-black font-semibold mr-3 '>Confirm Password</span>
        <br />
        <input type="text" className='p-0.5 border border-black' name='confirm_password' value={data.confirm_password} onChange={changeHandler} />
      </div>
      {
        processing ?
          <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg animate-pulse' disabled>Processing...</button>
          :
          <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg' onClick={setPasswordHandler}>Change Password</button>
      }
    </Fragment>
  )
}
