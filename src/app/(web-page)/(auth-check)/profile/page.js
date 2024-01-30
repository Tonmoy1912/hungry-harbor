"use client";
import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

export default function page() {
  const { data, status } = useQuery({
    queryKey: [`profile-page-data`],
    queryFn: async function () {
      let userData = await fetch("/api/auth/user-info");
      userData = await userData.json();
      // console.log("user data",userData);
      return userData.userData;
    },
    placeholderData: {
      avatar: "https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/profile%2Fdefault-profile.png?alt=media&token=6de54cec-1899-498b-b0ec-9a1c1d2cbfb0",
      name: "",
      email: "",
      phone: "",
      address: ""
    },
    staleTime: 10 * 60 * 1000
  });



  return (
    <div className='w-full flex flex-col gap-6 justify-start items-center p-6 bg-slate-300 '>

      <div className='w-11/12 flex justify-center self-center py-6 bg-blue-700 rounded-lg shadow-lg shadow-blue-500'>
        <Image src={data.avatar} height={200} width={200} alt='user profile' className='rounded-full h-40 w-40'></Image>
      </div>

      <div className='w-11/12 p-3 md:p-8 flex flex-col gap-5 bg-blue-500 rounded-lg shadow-lg shadow-blue-400'>
        <div className='pb-4  border-b border-b-slate-600'>
          <h1 className='py-2 text-xl text-black font-semibold'>Name</h1>
          <input className='p-0.5 rounded-sm bg-slate-300' type="text" value={data.name} />
        </div>
        <div className='pb-4  border-b border-b-slate-600'>
          <h1 className='py-2 text-xl text-black font-semibold'>Email</h1>
          <input className='p-0.5 rounded-sm bg-slate-300' type="text" value={data.email} />
        </div>
        <div className='pb-4  border-b border-b-slate-600'>
          <h1 className='py-2 text-xl text-black font-semibold'>Phone</h1>
          <input className='p-0.5 rounded-sm bg-slate-300' type="text" value={data.phone} />
        </div>
        <div className='pb-4 '>
          <h1 className='py-2 text-xl text-black font-semibold'>Address</h1>
          <textarea className='p-0.5 rounded-sm bg-slate-300' value={data.address} />
        </div>

      </div>



    </div>
  )
}
