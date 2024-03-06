"use client";
import React, { Fragment, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { progressAtom } from '@/store/progressAtom';

export function StopProgress(){
    const setProgress=useSetRecoilState(progressAtom);
    useEffect(()=>{
        setProgress(false);
    },[]);
    return (
        null
    )
}