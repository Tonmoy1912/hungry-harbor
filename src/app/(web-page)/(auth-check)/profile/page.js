"use client";
//completely done
import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Notification from '@/components/notification.js/Notification';
import Link from 'next/link';

export default function page() {
  const { data, status} = useQuery({
    queryKey: [`profile-page-data`],
    queryFn: async function () {
      let userData = await fetch("/api/auth/user-info");
      userData = await userData.json();
      // setDataState(userData.userData);
      return userData.userData;
    },
    placeholderData: {
      avatar: "https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/profile%2Fdefault-profile.png?alt=media&token=6de54cec-1899-498b-b0ec-9a1c1d2cbfb0",
      name: "Loading...",
      email: "Loading...",
      phone: "Loading...",
      address: "Loading..."
    },
    staleTime: 10 * 60 * 1000
  });

  const [dataState, setDataState] = useState({...data});
  const [noti, setNoti] = useState({ type: "", message: "", show: false });

  useEffect(() => {
    setDataState({...data});
  }, [data]);

  function handleChange(e) {
    setDataState({
      ...dataState, [e.target.name]: e.target.value
    });
  }

  function handleNoti() {
    setNoti({ type: "", message: "", show: false });
  }

  return (
    <div className='w-full flex flex-col gap-6 justify-start items-center p-6 bg-slate-300 '>

      <div className='p-5 w-11/12 flex flex-col gap-4 justify-center items-center self-center py-6 bg-blue-500 rounded-lg shadow-lg shadow-blue-600'>
        <Image src={data.avatar} height={200} width={200} alt='user profile' className='rounded-full h-40 w-40'></Image>
        <Link href={"/profile/change-password"} className='px-1 border border-black text-sm bg-slate-300 text-black'>Change Password</Link>
      </div>

      <div className='w-11/12 p-3 md:p-8 flex flex-col gap-5 bg-blue-300 rounded-lg shadow-lg shadow-blue-400'>

        <InputField type="input" data={dataState} name={"name"} fieldName={"Name"} handleChange={handleChange} setNoti={setNoti} queryData={data} setDataState={setDataState}/>

        <div className='pb-4  border-b border-b-slate-600'>
          <h1 className='py-2 text-xl text-black font-semibold'>Email</h1>
          <input className='p-0.5 rounded-sm bg-slate-300' type="text" value={data.email} disabled={true} />
        </div>

        <InputField type="input" data={dataState} name={"phone"} fieldName={"Phone"} handleChange={handleChange} setNoti={setNoti} queryData={data} setDataState={setDataState}/>

        <InputField type="textarea" data={dataState} name={"address"} fieldName={"Address"} handleChange={handleChange} setNoti={setNoti} queryData={data} setDataState={setDataState}/>

      </div>


      <Notification type={noti.type} message={noti.message} onClick={handleNoti} show={noti.show} />
    </div>
  )
}


function InputField({ data, type, fieldName, name, handleChange, setNoti,queryData,setDataState }) {

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSave,
    mutationKey: [`profile-${name}`],
    onSuccess: () => {
      // Invalidate and refetch
      console.log("On success called");
      setTimeout(()=>{queryClient.invalidateQueries({ queryKey: [`profile-page-data`] });},1000);
      
    },
  });

  function handleDisable() {
    setDisabled(false);
    setShowSave(true);
  }

  function handleSave() {
    setShowSave(false);
    setDisabled(true);
    setProcessing(true);
    // const prevUser=dataState;
    if(!data[name]||data[name]==""){
      setNoti({ type: "Failed", message: "Enter valid input", show: true });
      setProcessing(false);
      setDataState({...queryData});
      return ;
    }
    fetch("/api/auth/update-userinfo", {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify({ name: name, value: data[name] }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(data => data.json())
      .then(data => {
        setProcessing(false);
        setNoti({ type: `${data.ok ? "Success" : "Failed"}`, message: data.message, show: true });
        if(!data.ok){
          setDataState({...queryData});
        }
      })
      .catch(err => {
        setProcessing(false);
        setNoti({ type: "Failed", message: err.message, show: true });
      })
  }


  if (type == "input") {
    return (
      <Fragment>
        <div className='pb-4  border-b border-b-slate-600'>
          <h1 className='py-2 text-xl text-black font-semibold'>{fieldName}</h1>
          <input className={`p-0.5 rounded-sm ${disabled ? "bg-slate-300 " : "bg-slate-100"}`} type="text" value={data[name]} name={name} onChange={handleChange} disabled={disabled} />
          <br />
          {disabled && !processing && <button className='m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-blue-800' onClick={handleDisable}>Edit</button>}
          {showSave && <button className='m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-green-800' onClick={() => { mutation.mutate() }}>Save</button>}
          {processing && <button className='animate-pulse m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-blue-800 ' disabled={true}>Processing...</button>}
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className='pb-4 '>
        <h1 className='py-2 text-xl text-black font-semibold'>{fieldName}</h1>
        <textarea rows={4} cols={30} className={`p-0.5 rounded-sm ${disabled ? "bg-slate-300 " : "bg-slate-100"} max-w-[85%]`} value={data[name]} name={name} onChange={handleChange} disabled={disabled} />
        <br />
        {disabled && !processing && <button className='m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-blue-800' onClick={handleDisable}>Edit</button>}
        {showSave && <button className='m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-green-800' onClick={() => { mutation.mutate() }}>Save</button>}
        {processing && <button className='animate-pulse m-2 py-1 px-2 text-white text-sm font-semibold rounded-md bg-blue-800 ' disabled={true}>Processing...</button>}
      </div>
    </Fragment>
  );

}