"use client";
//completely done
import React, { Fragment, useState } from 'react'
import Notification from '@/components/notification/Notification';
import Link from 'next/link';

export default function page() {
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const [noti, setNoti] = useState({ type: "", message: "", show: false });
    function changeHandler(e) {
        setData({
            ...data, [e.target.name]: e.target.value
        });
    }
    function clickHandler() {
        let emptyFlag = false;
        for (let i in data) {
            if (data[i] == "") {
                emptyFlag = true;
            }
        }
        if (emptyFlag) {
            setNoti({ type: "Info", message: "All the field must be filled", show: true });
            return;
        }
        if (data.new_password != data.confirm_password) {
            setNoti({ type: "Failed", message: "New password and confirm password did not match", show: true });
            return;
        }
        if (data.old_password == data.new_password) {
            setNoti({ type: "Info", message: "The new password must be different.", show: true });
            return;
        }
        setProcessing(true);
        fetch("/api/auth/change-password", {
            cache: "no-store",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(data => data.json())
            .then(data => {
                setNoti({ type: `${data.ok ? "Success" : "Failed"}`, message: data.message, show: true });
                setProcessing(false);
            })
            .catch(err => {
                setNoti({ type: "Failed", message: err.message, show: true });
                setProcessing(false);
            })
    }
    function handleNoti() {
        setNoti({ type: "", message: "", show: false });
    }
    return (
        <Fragment>
            <div className='w-11/12  p-3 md:p-8 flex flex-col justify-start items-center sm:items-start gap-5 bg-blue-200 rounded-lg shadow-lg shadow-blue-400 mx-auto my-8'>

                <h1 className='text-3xl font-extrabold text-black self-center'>Change Password</h1>
                <span className='text-xl text-black font-bold'>Old Password</span>
                <input type="password" className='p-0.5 rounded-sm bg-slate-100' name='old_password' value={data.old_password} onChange={changeHandler} />
                <span className='text-xl text-black font-bold'>New Password</span>
                <input type="password" className='p-0.5 rounded-sm bg-slate-100' name='new_password' value={data.new_password} onChange={changeHandler} />
                <span className='text-xl text-black font-bold'>Confirm Password</span>
                <input type="text" className='p-0.5 rounded-sm bg-slate-100' name='confirm_password' value={data.confirm_password} onChange={changeHandler} />
                    {
                        processing ?
                            <button className='py-1 px-3 bg-blue-800  text-white font-semibold rounded-lg shadow-md shadow-blue-900 animate-pulse' disabled={true}>Processing...</button>
                            :
                            <button className='py-1 px-3 bg-green-800 text-white font-semibold rounded-lg shadow-md shadow-green-900' onClick={clickHandler}>Change</button>
                    }
                <Link href={"/forgot-password"} className='py-1 px-3 bg-blue-800 self-center text-white font-semibold rounded-lg shadow-md shadow-blue-900 '>Forgot Password</Link>
            </div>
            <Notification type={noti.type} message={noti.message} onClick={handleNoti} show={noti.show} />
        </Fragment>
    )
}
