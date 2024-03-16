"use client";
import React, { Fragment, useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Legend } from 'chart.js';
import { toast, Slide, Bounce } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend);

function getFormatedDate(date){
  let str=date.toDateString();
  let arr=str.split(" ");
  return arr[2]+" "+arr[1];
}

export function DashboardComponents() {

  const [stats, setStats] = useState([]);
  const [sells, setSells] = useState([]);
  const [placedCancelled, setPlacedCancelled] = useState([]);

  useEffect(() => {
    fetch("/api/statistics/get-stats", {
      cache: "no-store",
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          setStats(res.stats);
        }
        else {
          toast.error(res.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      })
      .catch(err => {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      })
  }, []);

  const data1 = {
    labels: stats.map(x=>getFormatedDate(new Date(x.date))),
    datasets: [{
      label: "Sells",
      data: stats.map(x=>x.sells),
      backgroundColor: "blue"
    }]
  };

  const data2 = {
    labels: stats.map(x=>getFormatedDate(new Date(x.date))),
    datasets: [{
      label: "Orders Placed",
      data: stats.map(x=>x.orders_placed),
      backgroundColor: "blue"
    }, {
      label: "Orders Cancelled",
      data: stats.map(x=>x.orders_cancelled),
      backgroundColor: "red"
    }]
  };

  // const data1 = {
  //   labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  //   datasets: [{
  //     label: "Sells1",
  //     data: [1, 8, 3, 4, 7, 8, 2, 4, 7, 5, 5, 8, 3, 4, 7, 8, 2, 4, 7, 5, 5, 8, 3, 4, 7, 8, 2, 4, 7, 5],
  //     backgroundColor: "blue"
  //   }, {
  //     label: "Sells2",
  //     data: [5, 8, 3, 4, 7, 8, 2, 4, 7, 5, 5, 8, 3, 4, 7, 8, 2, 4, 7, 5, 5, 8, 3, 4, 7, 8, 2, 4, 7, 5],
  //     backgroundColor: "red"
  //   }]
  // };

  return (
    <div className='p-2 md:p-3 flex flex-col gap-8 justify-start items-center'>
      <div className='bg-slate-100 h-auto md:min-h-96 w-full shadow-md shadow-slate-500 '>
        <h1 className='text-center text-xl font-semibold text-blue-950' >Sells</h1>
        <Bar data={data1} />
      </div>
      <div className='bg-slate-100 h-auto md:min-h-96 w-full shadow-md shadow-slate-500 '>
        <h1 className='text-center text-xl font-semibold text-blue-950' >Placed and Cancelled Orders</h1>
        <Bar data={data2} />
      </div>
    </div>
  )
}
