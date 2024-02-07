"use client";
import React, { useState } from 'react';
import { getFirebaseStorage } from '@/config/firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';
import Image from 'next/image';

export default function page() {
  const [name,setName]=useState("");
  const [file,setFile]=useState(null);
  async function submitHandler(){
    const storage=await getFirebaseStorage();
    console.log("storage",storage);
    const imageRef=ref(storage,`items/${file.name+v4()}`);
    const snapshot=await uploadBytes(imageRef,file);
    const url=await getDownloadURL(snapshot.ref);
    console.log("url",url);
    alert(url);
  }
  return (
    <div>
      <input type="text" value={name} onChange={e=>setName(e.target.value)} />
      <input type="file" onChange={e=>setFile(e.target.files[0])}/>
      <button onClick={submitHandler}>Submit</button>
      <br />
      <Image src={"https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/items%2FScreenshot%202023-07-26%20104842.png25eb53a6-a69b-42a9-beb1-6710cfb71d36?alt=media&token=afef8226-8a3e-419d-ad98-af1fa9fb5808"} width={500} height={500} className='h-[200px] w-[200px]'></Image>
      <Image src={"https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/items%2Ftanmay%20(1).jpgbc9f6a21-1bac-4abb-96a1-82e8078fa3cc?alt=media&token=fc7fd87f-f189-4b1e-89b8-8a82599eece3"} width={500} height={500} className='h-[200px] w-[200px]'></Image>
    </div>
  )
}
