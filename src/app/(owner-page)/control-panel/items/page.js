"use client";
import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import {  AddCategory, RemoveCategory } from '@/components/category-component/categoryComponent';
import { AddItemButton } from '@/components/item/AddItem';
import AdminItemWindow from '@/components/item/AdminItemWindow';
import { GrLinkNext } from "react-icons/gr";
import Link from 'next/link';

export default function page() {

  return (
    <Fragment>
      <div className='mt-3 ml-3 flex justify-start items-center gap-3 flex-wrap'>
        <AddItemButton />
        <AddCategory />
        <RemoveCategory />
        <Link href={"/control-panel/items/removed-items"} className='py-1 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white  font-semibold flex items-center gap-2 shadow-md shadow-blue-800' > Removed items <GrLinkNext/> </Link>
      </div>
    <AdminItemWindow />
    </Fragment>
  )

}
