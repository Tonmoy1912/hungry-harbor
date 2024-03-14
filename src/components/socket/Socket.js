"use client";
import React, { Fragment, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function SocketComponent() {

    const socket = io("http://localhost:8000/");

    socket.on("connect", () => {
        // console.log(`Socket connect established with server with socket id ${socket.id} .`); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        // console.log(`Socket with id ${socket.id} get disconnected.`); // undefined
    });

    socket.on("send-token", function () {
        fetch("/api/auth/socket-connection-token", {
            cache: "no-store",
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {
                socket.emit("set-token", res.token);
            })
            .catch(err => {
                // console.log(err.message);
            })
    });

    useEffect(()=>{
        return ()=>{
            socket.disconnect();
        }
    },[])

    return (
        <Fragment>
        </Fragment>
    );
}
