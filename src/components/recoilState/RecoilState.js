"use client";

import React,{ useEffect } from "react";
import { RecoilRoot,useRecoilSnapshot } from "recoil";

export default function RecoilState({ children }) {
    
    return (
        <RecoilRoot>
            {/* <RecoilDebugTool/> */}
            {children}
        </RecoilRoot>
    )
}

function RecoilDebugTool(){
    const snapshot = useRecoilSnapshot();
    useEffect(() => {
        console.log('The following atoms were modified:');
        for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
            console.log(node.key, snapshot.getLoadable(node));
        }
    }, [snapshot]);
    return null;
}
