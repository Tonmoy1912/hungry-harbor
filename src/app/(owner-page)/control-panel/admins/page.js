"use client";
//completely done
import React, { Fragment, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Notification from '@/components/notification.js/Notification';

export default function page() {
  const [admins, setAdmins] = useState([]);
  const [noti, setNoti] = useState({ message: "", type: "", show: false });
  function notiHandler() {
    setNoti({ message: "", type: "", show: false });
  }
  function fetchAdmins() {
    fetch("/api/admin/get-admins", { cache: "no-store" })
      .then(data => data.json())
      .then(data => {
        if (!data.ok) {
          setNoti({ message: data.message, type: data.type, show: true });
          setAdmins([]);
          return;
        }
        setAdmins(data.admins);
      })
      .catch(err => {
        setNoti({ message: err.message, type: "Failed", show: true });
      });
  }
  useEffect(() => {
    fetchAdmins();
  }, []);
  return (
    <Fragment>
      <div className='p-2 md:p-5 flex flex-col justify-start items-start gap-6'>
        <AddButton setNoti={setNoti} fetchAdmins={fetchAdmins} />
        {
          admins.map(admin => {
            return <AdminBox user={admin.user} key={admin.email} fetchAdmins={fetchAdmins} setNoti={setNoti} />
          })
        }
      </div>
      {noti.show && <Notification message={noti.message} type={noti.type} show={noti.show} onClick={notiHandler} />}
    </Fragment>
  )
};

function AddButton({ setNoti, fetchAdmins }) {
  const [inputDisplay, setInputDisplay] = useState(false);
  function clickHandler() {
    setInputDisplay(true);
  }
  return (
    <Fragment>
      <button className='px-3 py-2 bg-blue-900  rounded-lg  flex justify-center gap-3 items-center text-white font-bold hover:bg-blue-700 hover:text-white ' onClick={clickHandler}><IoMdAdd className='scale-150 ' /> Add admin</button>
      {inputDisplay && <AdminInputBox setInputDisplay={setInputDisplay} setNoti={setNoti} fetchAdmins={fetchAdmins} />}
    </Fragment>
  );
}

function AdminBox({ user, fetchAdmins ,setNoti}) {
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  function onYes() {
    fetch("/api/admin/remove-admin", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: user.email.trim() })
    })
      .then(data => data.json())
      .then(data => {
        if (data.ok) {
          fetchAdmins();
        }
        else {
          setNoti({ message: data.message, type: data.type, show: true });
        }
      })
      .catch(err => {
        setNoti({ message: err.message, type: "Failed", show: true });
      });
    setShowConfirmBox(false);
  }
  function onCancel() {
    setShowConfirmBox(false);
  }
  return (
    <Fragment>
      <div className='w-full p-3 rounded-xl bg-blue-300 shadow-lg shadow-blue-400 flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
        <p className='font-semibold text-black '>{user.name}</p>
        <p className='text-black  flex justify-start gap-2 items-center '> < MdOutlineMailOutline /> <span>{user.email}</span> </p>
        <p className='text-black  flex justify-start gap-2 items-center '> < FaPhoneAlt /> <span>{user.phone == "" ? "None" : user.phone}</span> </p>
        <button className='px-2 py-1 bg-red-700 hover:bg-red-600 text-white font-semibold text-sm rounded-lg self-center flex justify-start gap-1 items-center' onClick={() => { setShowConfirmBox(true) }}> <span>Remove</span> <RiDeleteBinLine /></button>
      </div>
      {showConfirmBox && <ConfirmBox onYes={onYes} onCancel={onCancel} />}
    </Fragment>
  );
}


function AdminInputBox({ setInputDisplay, setNoti, fetchAdmins }) {
  const [email, setEmail] = useState("");
  function changeHandler(e) {
    setEmail(e.target.value);
  }
  function clickHandler() {
    const trimEmail = email.trim();
    if (trimEmail == "") {
      setNoti({ message: "Enter valid input", type: "Info", show: true });
      return;
    }
    fetch("/api/admin/add-admin", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email.trim() })
    })
      .then(data => data.json())
      .then(data => {
        if (data.ok) {
          fetchAdmins();
        }
        else {
          setNoti({ message: data.message, type: data.type, show: true });
        }
      })
      .catch(err => {
        setNoti({ message: err.message, type: "Failed", show: true });
      });
    setInputDisplay(false);
  }
  return (
    <div className='p-3 flex flex-col md:flex-row gap-2 justify-start   bg-blue-200 border border-blue-800 rounded-md w-full md:w-auto '>
      <input type="email" className='p-0.5 rounded-sm bg-slate-100' placeholder='Enter Email' value={email} onChange={changeHandler} />
      <button className='px-2 py-1 bg-green-700 hover:bg-green-600 rounded-lg text-white text-sm font-semibold' onClick={clickHandler}>Add</button>
    </div>
  )
}

function ConfirmBox({ onYes, onCancel }) {
  return (
    <div className='z-10 fixed top-0 left-0 h-screen w-screen flex justify-center items-center'>
      <div className={`min-h-[30%] w-[70%] md:w-[40%] bg-blue-900 shadow-lg shadow-blue-950 text-2xl flex flex-col justify-around font-extrabold  items-center gap-3 sm:gap-5 rounded-3xl pb-6 overflow-clip`}>
        <p className={`font-extrabold text-md text-center text-white break-words p-3`}>Dismiss as admin</p>
        <div className='flex justify-center items-center gap-5'>
          <button className='h-8 w-16 bg-red-700  text-white font-semibold text-sm rounded-lg hover:bg-red-600' onClick={onYes}> Yes </button>
          <button className='h-8 w-16 bg-slate-300  text-black font-semibold text-sm rounded-lg hover:bg-slate-200' onClick={onCancel}> Cancel </button>
        </div>
      </div>
    </div>
  );
}