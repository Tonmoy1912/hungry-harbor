"use client";
import React, { Fragment, useState, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { progressAtom } from '@/store/progressAtom';
import { notiAtom } from '@/store/notiState';
import { FaSearch } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlinePreview } from "react-icons/md";
import ConfirmBox from '../confirm-box/ConfirmBox';
import Image from 'next/image';
import { categoryAtom } from '@/store/categoryAtom';

export function RemovedItemsWindow() {
  const [removedItems, setRemovedItems] = useState([]);
  const setProgressState = useSetRecoilState(progressAtom);
  const setNoti = useSetRecoilState(notiAtom);
  const [search, setSearch] = useState("");
  const [filterdItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProgressState(true);
    setLoading(true);
    fetch("/api/items/get-removed-items", {
      cache: "no-store",
      method: "GET"
    }).then(data => data.json())
      .then(data => {
        setRemovedItems(data.items);
        setLoading(false);
        setProgressState(false);
      })
      .catch(err => {
        setProgressState(false);
        setLoading(false);
        setNoti({ message: err.message, type: "Failed", show: true });
      })
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      let newList = removedItems.filter(x => {
        let name = x.name.toLowerCase();
        return name.includes(search.toLowerCase().trim());
      });
      setFilteredItems(newList);
      // console.log("search",search);
    }, 500);
    return () => {
      clearTimeout(id);
    }
  }, [search, removedItems]);

  return (
    <Fragment>
      <div className='mx-4 my-6 border border-blue-900 shadow-lg shadow-blue-950 bg-blue-900 rounded-md overflow-clip'>
        <TopBar search={search} setSearch={setSearch} />
        {
          loading ?
            (
              <h1 className='bg-slate-200 '>
                <span className='text-blue-950 text-2xl font-bold py-1 px-2 animate-pulse'>Loading...</span>
              </h1>
            ) : (
              filterdItems.length == 0 ? (
                <h1 className='bg-slate-200 '>
                  <span className='text-blue-950 text-2xl font-bold py-1 px-2 '>No item found</span>
                </h1>
              ) :
                filterdItems.map(item => {
                  return <RemovedItemBox item={item} key={item._id} setRemovedItems={setRemovedItems} />
                })
            )
        }
      </div>
    </Fragment>
  );
}

function TopBar({ search, setSearch }) {
  return (
    <Fragment>
      <div className='bg-blue-500 p-2 flex gap-3 items-center  justify-end rounded-t-md mb-0.5'>
        <div className='flex items-center gap-2'>
          <FaSearch className='text-white scale-110' />
          <input type="search" className='p-0.5 md:p-1 text-blue-800 w-64 rounded-lg border border-white bg-blue-50 shadow-inner shadow-blue-500 ' placeholder='Search by name' value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
    </Fragment>
  );
}

function RemovedItemBox({ item, setRemovedItems }) {
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const setProgressState = useSetRecoilState(progressAtom);
  const setNoti = useSetRecoilState(notiAtom);
  const setCategories=useSetRecoilState(categoryAtom);

  function hideConfirmBox() {
    setShowConfirmBox(false);
  }
  async function restoreHandler() {
    setProgressState(true);
    setShowConfirmBox(false);
    try {
      let res = await fetch("/api/items/restore-item", {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: item._id })
      });
      res = await res.json();
      setNoti({ message: res.message, type: res.type, show: true });
      if (res.ok) {
        setRemovedItems(prevItems => {
          return prevItems.filter(prevItem => prevItem._id != item._id);
        });
        setCategories(categories => {
          let newList = categories.map(x => {
            if (x.category == item.category || x.category == "ALL") {
              return { ...x, total: x.total + 1 };
            }
            else {
              return x;
            }
          });
          return newList;
        })
      }
    }
    catch (err) {
      setNoti({ message: err.message, type: "Failed", show: true });
    }
    setProgressState(false);
  }
  return (
    <Fragment>
      <div className='relative pb-2 md:pb-0 md:h-64 bg-slate-200 my-0.5 flex  flex-col md:flex-row'>
        <div className='w-full h-48 md:w-1/3  md:h-full p-1'>
          <Image src={item.image} height={400} width={400} alt={`${item.name}'s image`} className='h-full w-full rounded-md border border-blue-800' ></Image>
        </div>
        <div className='w-full md:w-2/3 md:h-full p-1.5 flex flex-col justify-start gap-1.5 items-start pl-4'>
          <h1 className='text-xl text-black font-bold'>{item.name}</h1>
          <button className='px-1.5 py-0.5 rounded-lg bg-green-600 text-white text-xs font-semibold flex gap-1 items-center ' disabled={true}>  <span>{item.total_review != 0 ? item.rating : "Unrated"}</span> <IoStarSharp />  </button>
          <button className='px-1.5 py-0.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold' disabled={true}>{item.category}</button>
          <button className='px-1.5 py-0.5 rounded-lg  text-black text-xs font-semibold flex gap-1 items-center ' disabled={true}> <MdOutlineRateReview className='scale-125' />  <span>{item.total_review}</span></button>
          <button className='px-1.5  rounded-lg  text-black text-xs font-bold flex gap-1 items-center ' disabled={true}> <FaRupeeSign className='scale-125' />  <span className='text-lg'>{item.price}</span></button>
        </div>
        <div className='relative mt-4 pl-5  md:absolute bottom-2 right-2 flex flex-wrap gap-3 items-center justify-self-end md:mt-4  px-2 text-sm self-end'>
          <button className='px-2 py-1 rounded-md bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold flex gap-1 items-center ' > View <MdOutlinePreview className='scale-110' /> </button>
          <button className='px-2 py-1 rounded-md bg-green-700 hover:bg-green-600 text-white text-xs font-semibold flex gap-1 items-center' onClick={() => { setShowConfirmBox(true) }} > Restore </button>
          <button className='px-2 py-1 rounded-md bg-red-700 hover:bg-red-600 text-white text-xs font-semibold flex gap-1 items-center' > Remove Permanently <RiDeleteBinLine /> </button>
        </div>
      </div>
      <ConfirmBox onYes={restoreHandler} onCancel={hideConfirmBox} show={showConfirmBox} text={`Restore ${item.name} `} />
    </Fragment>
  )
}