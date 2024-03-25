"use client";
//completely done
import React, { Fragment, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import { progressAtom } from '@/store/progressAtom';
import { useSetRecoilState } from 'recoil';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notiAtom } from '@/store/notiState';
import { StopProgress } from '@/components/util/util';


export default function page() {
  // const [admins, setAdmins] = useState([]);
  const {data:admins} = useQuery({ queryKey: ["admin-list"], queryFn: fetchAdmins,placeholderData:[],staleTime:2*60*1000 });
  const setNoti=useSetRecoilState(notiAtom);
  function notiHandler() {
    setNoti({ message: "", type: "", show: false });
  }
  async function fetchAdmins() {
    try {
      let data = await fetch("/api/admin/get-admins", { cache: "no-store" });
      data = await data.json();

      if (!data.ok) {
        setNoti({ message: data.message, type: data.type, show: true });
        return [];
      }
      return data.admins;
    }
    catch (err) {
      setNoti({ message: err.message, type: "Failed", show: true });
      return [];
    }
  }
  // useEffect(() => {
  //   fetchAdmins();
  // }, []);
  return (
    <Fragment>
      <StopProgress />
      <div className='p-2 md:p-5 flex flex-col justify-start items-start gap-6'>
        <AddButton setNoti={setNoti} fetchAdmins={fetchAdmins} />
        {admins.length != 0 ?
          (
            admins.map(admin => {
              return <AdminBox user={admin.user} key={admin.email} fetchAdmins={fetchAdmins} setNoti={setNoti} />
            })
          ) :
          (
            <p className='text-2xl font-bold text-blue-950 animate-pulse '> Loading...</p>
          )
        }
      </div>
    </Fragment>
  )
};

function AddButton({ setNoti, fetchAdmins }) {
  const [inputDisplay, setInputDisplay] = useState(false);
  //testing
  // const setProgressState=useSetRecoilState(progressAtom);
  //testing

  function clickHandler() {
    setInputDisplay(!inputDisplay);
    //testing
    // setProgressState(true);
    // setTimeout(()=>{setProgressState(false)},2000);
    //testing
  }
  return (
    <Fragment>
      <button className='px-3 py-1.5 bg-blue-900  rounded-lg  flex justify-center gap-3 items-center text-white font-bold hover:bg-blue-800 hover:text-white ' onClick={clickHandler}><IoMdAdd className='scale-150 ' /> Add admin</button>
      {inputDisplay && <AdminInputBox setInputDisplay={setInputDisplay} setNoti={setNoti} fetchAdmins={fetchAdmins} />}
    </Fragment>
  );
}

function AdminBox({ user, fetchAdmins, setNoti }) {
  const queryClient=useQueryClient();
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const setProgressState = useSetRecoilState(progressAtom);
  function onYes() {
    setProgressState(true);
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
          // fetchAdmins();
          queryClient.invalidateQueries({ queryKey: ['admin-list'] });
        }
        else {
          setNoti({ message: data.message, type: data.type, show: true });
        }
        setProgressState(false);
      })
      .catch(err => {
        setNoti({ message: err.message, type: "Failed", show: true });
        setProgressState(false);
      });
    setShowConfirmBox(false);
  }
  function onCancel() {
    setShowConfirmBox(false);
  }
  return (
    <Fragment>
      <div className='w-full p-3 rounded-xl bg-blue-300 shadow-lg shadow-blue-400 flex flex-col gap-3  '>
        <p className='font-semibold text-black '>{user.name}</p>
        <p className='text-black  flex justify-start gap-2 items-center '> < MdOutlineMailOutline /> <span>{user.email}</span> </p>
        <p className='text-black  flex justify-start gap-2 items-center '> < FaPhoneAlt /> <span>{user.phone == "" ? "None" : user.phone}</span> </p>
        <button className='px-2 py-1 bg-red-700 hover:bg-red-600 text-white font-semibold text-sm rounded-lg self-center flex justify-start gap-1 items-center' onClick={() => { setShowConfirmBox(true) }}> <span>Remove</span> <RiDeleteBinLine /></button>
      </div>
      <ConfirmBox onYes={onYes} onCancel={onCancel} show={showConfirmBox} text={"Dismiss as admin"} />
    </Fragment>
  );
}


function AdminInputBox({ setInputDisplay, setNoti, fetchAdmins }) {
  const queryClient=useQueryClient();
  const [email, setEmail] = useState("");
  const setProgressState = useSetRecoilState(progressAtom);
  function changeHandler(e) {
    setEmail(e.target.value);
  }
  function clickHandler() {
    const trimEmail = email.trim();
    if (trimEmail == "") {
      setNoti({ message: "Enter valid input", type: "Info", show: true });
      return;
    }
    setProgressState(true);
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
          // fetchAdmins();
          queryClient.invalidateQueries({ queryKey: ['admin-list'] });
        }
        else {
          setNoti({ message: data.message, type: data.type, show: true });
        }
        setProgressState(false);
      })
      .catch(err => {
        setNoti({ message: err.message, type: "Failed", show: true });
        setProgressState(false);
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
