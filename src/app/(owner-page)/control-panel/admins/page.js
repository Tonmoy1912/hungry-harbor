"use client";
import React, { Fragment, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

export default function page() {
  return (
    <div className='p-5 flex flex-col justify-start items-start gap-6'>
      <AddButton />
      <AdminBox user={{ name: "Tonmoy Biswas", email: "tonmoybiswas19122002@gmail.com", phone: "7063658215" }} />
      <AdminBox user={{ name: "Tonmoy Biswas", email: "tonmoybiswas@gmail.com", phone: "7063658215" }} />
    </div>
  )
};

function AddButton() {
  const [inputDisplay, setInputDisplay] = useState(false);
  function clickHandler() {
    setInputDisplay(true);
  }
  return (
    <Fragment>
      <button className='px-3 py-2 bg-blue-900  rounded-lg  flex justify-center gap-3 items-center text-white font-bold hover:bg-blue-700 hover:text-white ' onClick={clickHandler}><IoMdAdd className='scale-150 ' /> Add admin</button>
      {inputDisplay && <AdminInputBox setInputDisplay={setInputDisplay} />}
    </Fragment>
  );
}

function AdminBox({ user }) {
  return (
    <Fragment>
      <div className='w-full p-3 rounded-xl bg-blue-300 shadow-lg shadow-blue-400 flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
        <p className='font-semibold text-black '>{user.name}</p>
        <p className='text-black  flex justify-start gap-2 items-center '> < MdOutlineMailOutline /> <span>{user.email}</span> </p>
        <p className='text-black  flex justify-start gap-2 items-center '> < FaPhoneAlt /> <span>{user.phone == "" ? "None" : user.phone}</span> </p>
        <button className='px-2 py-1 bg-red-700 hover:bg-red-600 text-white font-semibold text-sm rounded-lg self-center flex justify-start gap-1 items-center'> <span>Remove</span> <RiDeleteBinLine /></button>
      </div>
    </Fragment>
  );
}


function AdminInputBox({ setInputDisplay }) {
  const [email, setEmail] = useState("");
  function changeHandler(e) {
    setEmail(e.target.value);
  }
  function clickHandler() {
    setInputDisplay(false);
  }
  return (
    <div className='p-3 flex flex-col md:flex-row gap-2 justify-start   bg-blue-200 border border-blue-800 rounded-md w-full md:w-auto '>
      <input type="email" className='p-0.5 rounded-lg bg-slate-100' placeholder='Enter Email' value={email} onChange={changeHandler} />
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
          <button className='h-8 w-16 bg-red-700  text-white font-semibold text-sm rounded-lg ' onClick={onYes}> Yes </button>
          <button className='h-8 w-16 bg-slate-100  text-black font-semibold text-sm rounded-lg ' onClick={onCancel}> Cancel </button>
        </div>
      </div>
    </div>
  );
}