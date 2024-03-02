"use client";

import React,{Fragment} from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
  return (
    <Fragment>
        <ToastContainer />
    </Fragment>
  )
}
