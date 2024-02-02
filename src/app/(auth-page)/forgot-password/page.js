"use client";
import React, { Fragment, useState } from 'react';
import Notification from '@/components/notification.js/Notification';

export default function page() {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [sendAgain,setSendAgain]=useState(false);
  const [showInput, setShowInput] = useState(false);
  const [noti, setNoti] = useState({ message: "", type: "", show: false });
  const [processing, setProcessing] = useState(false);
  function changeHandler(e) {
    setEmail(e.target.value);
  }
  function handleNoti() {
    setNoti({ message: "", type: "", show: false })
  }
  function sendOTPHandler() {
    console.log("email", email);
    setProcessing(true);
    setTimeout(() => {
      setNoti({ message: "OTP is sent to the given email. Please submit the OTP and change password within 5 minutes.", type: "Success", show: true });
      setProcessing(false);
      setSendAgain(true);
      setShowOTP(true);
      setShowInput(false);
    }, 2000);
  }
  return (
    <Fragment>
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
              <button className='py-1 px-3 bg-black text-white font-semibold rounded-lg' onClick={sendOTPHandler}>Send OTP {sendAgain?"Again":""} </button>
          }
          {showOTP && <OTPInput setShowInput={setShowInput} setShowOTP={setShowOTP} setNoti={setNoti}/>}
          {showInput && <PasswordInput setShowInput={setShowInput} setShowOTP={setShowOTP} setNoti={setNoti}/>}
        </div>
      </div>
      <Notification message={noti.message} type={noti.type} show={noti.show} onClick={handleNoti} />
    </Fragment>
  )
}

function OTPInput({ setShowInput, setShowOTP, setNoti }) {
  const [processing, setProcessing] = useState(false);
  const [otp, setOTP] = useState("");
  function submitHandler(){
    console.log("OTP",otp);
    setProcessing(true);
    setTimeout(()=>{
      setProcessing(false);
      setShowInput(true);
      setShowOTP(false);
    },2000);
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


function PasswordInput({ setShowInput, setShowOTP, setNoti }) {
  const [processing, setProcessing] = useState(false);
  const [data, setData] = useState({ new_password: "", confirm_password: "" });
  function changeHandler(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  function setPasswordHandler(){
    console.log("data",data);
    setProcessing(true);
    setTimeout(()=>{
      setProcessing(false);
      setNoti({message:"Password changed successfully",type:"Success",show:true});
    },2000);
  }
  return (
    <Fragment>
      <div className='w-10/12 border border-black'></div>
      <div>
        <span className='text-black font-semibold mr-3 '>New Password</span>
        <br />
        <input type="password" className='p-0.5 border border-black' name='new_password' value={data.new_password} onChange={changeHandler}/>
      </div>
      <div>
        <span className='text-black font-semibold mr-3 '>Confirm Password</span>
        <br />
        <input type="text" className='p-0.5 border border-black' name='confirm_password' value={data.confirm_password} onChange={changeHandler}/>
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
