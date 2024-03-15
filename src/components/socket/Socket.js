"use client";
import React, { Fragment, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast, Slide, Bounce } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { notiAtom } from '@/store/notiState';
import { userActiveOrderAtom, adminActiveOrderAtom } from '@/store/orderAtom';

export default function SocketComponent() {

    const setNoti=useSetRecoilState(notiAtom);
    const setUserActiveOrders=useSetRecoilState(userActiveOrderAtom);
    const setAdminActiveOrders=useSetRecoilState(adminActiveOrderAtom);

    useEffect(() => {
        //generating socket server origin
        let socketOrigin = window.origin.substring(0, window.origin.lastIndexOf(":") + 1) + "8000";
        const socket = io(socketOrigin);

        socket.on("connect", () => {
            console.log(`Socket connection established with server with socket id ${socket.id} .`); // x8WIv7-mJelg7on_ALbx
        });

        socket.on("disconnect", () => {
            console.log(`Socket with id ${socket.id} get disconnected.`); // undefined
        });

        //to set authorized connection to socket server
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

        //test
        socket.on("test-hello-world",(msg)=>{
            setNoti({show:true,message:msg,type:"Info"});
        });

        //acceptOrder event
        socket.on("acceptOrder",function(data){
            setUserActiveOrders(prev=>{
                return prev.map(x=>{
                    if(data._id==x._id){
                        return {
                            ...x,
                            status:data.status,
                            active:data.active,
                            ready_by:data.ready_by,
                            cooking_inst_status:data.cooking_inst_status
                        }
                    }
                    else{
                        return x;
                    }
                })
            });
            //set the notification
            if(data.status=="accepted"){
                toast.success("You order is accepted", {
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
            else{
                toast.error("You order is cancelled.", {
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
        });
        
        //deliveredOrder event
        socket.on("deliveredOrder",function(data){
            setUserActiveOrders(prev=>{
                return prev.filter(x=>x._id!=data._id);
            });
            //set the notification
            toast.success("You order is delivered", {
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
        });

        //readyOrder event
        socket.on("readyOrder",function(data){
            setUserActiveOrders(prev=>{
                return prev.map(x=>{
                    if(data._id==x._id){
                        return {
                            ...x,
                            status:data.status,
                            active:data.active
                        }
                    }
                    else{
                        return x;
                    }
                })
            });
            //set the notification
            toast.success("You order is ready", {
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
        });

        //userCancelOrder event 
        socket.on("userCancelOrder",function(data){
            setAdminActiveOrders(prev=>{
                return prev.filter(x=>x._id!=data._id);
            });
            //set the notification
            toast.error("A custom has cancelled his order", {
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
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <Fragment>
        </Fragment>
    );
}