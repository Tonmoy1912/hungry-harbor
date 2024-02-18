"use client";
import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import {  AddCategory, RemoveCategory } from '@/components/category-component/categoryComponent';
import { AddItemButton } from '@/components/item/AddItem';
import AdminItemWindow from '@/components/item/AdminItemWindow';

export default function page() {

  return (
    <Fragment>
      <div className='mt-3 ml-3 flex justify-start items-center gap-3'>
        <AddItemButton />
        <AddCategory />
        <RemoveCategory />
      </div>
    <AdminItemWindow />
    </Fragment>
  )

}
