"use client";
import React, { Fragment, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast, Slide, Bounce } from 'react-toastify';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { sessionAtom } from '@/store/sessionStore';
import { notiAtom } from '@/store/notiState';
import { userActiveOrderAtom, adminActiveOrderAtom } from '@/store/orderAtom';
import { useQueryClient } from '@tanstack/react-query';

export default function SocketComponent(){
    const session=useRecoilValue(sessionAtom);
    if(!session){
        return null;
    }
    return (
        <SocketComponentInternal />
    )
}

function SocketComponentInternal() {

    const setNoti=useSetRecoilState(notiAtom);
    const setUserActiveOrders=useSetRecoilState(userActiveOrderAtom);
    const setAdminActiveOrders=useSetRecoilState(adminActiveOrderAtom);
    const queryClient=useQueryClient();

    useEffect(() => {
        //generating socket server origin
        let socketOrigin = window.origin.substring(0, window.origin.lastIndexOf(":") + 1) + "8000";
        // const socket = io(socketOrigin);
        const socket = io("http://13.127.218.30:8000");

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

        //acceptOrder event for user
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
            // if(data.status=="accepted"){
            //     toast.success("You order is accepted", {
            //         position: "top-center",
            //         autoClose: 3000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         theme: "colored",
            //         transition: Bounce,
            //     });
            // }
            // else{
            //     toast.error("You order is cancelled.", {
            //         position: "top-center",
            //         autoClose: 3000,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         theme: "colored",
            //         transition: Bounce,
            //     });
            // }
        });
        
        //deliveredOrder event for user
        socket.on("deliveredOrder",function(data){
            setUserActiveOrders(prev=>{
                return prev.filter(x=>x._id!=data._id);
            });
            //set the notification
            // toast.success("You order is delivered", {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            //     transition: Bounce,
            // });
        });

        //readyOrder event for user
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
            // toast.success("You order is ready", {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            //     transition: Bounce,
            // });
        });

        //userCancelOrder event for owner
        socket.on("userCancelOrder",function(data){
            setAdminActiveOrders(prev=>{
                return prev.filter(x=>x._id!=data._id);
            });
            // set the notification
            // toast.error("A custom has cancelled his order", {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "colored",
            //     transition: Bounce,
            // });
        });

        //new order added for admin
        socket.on("newOrder",function(data){
            toast.success("A new order received", {
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
            fetch(`/api/order/get-order-by-id`, {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({_id:data._id})
            })
            .then(res=>res.json())
            .then(res=>{
                if(res.ok){
                    setAdminActiveOrders(prev=>{
                        return [{...res.order},...prev];
                    });
                }
            })
            .catch(err=>{
                toast.success(err.message, {
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
        });

        //for realtime notification to the user
        socket.on("receivedNotification",function(data){
            toast.info(data.message, {
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

        //to both user and owner when ever a item is updated
        socket.on("itemsUpdate",function(){
            queryClient.invalidateQueries({queryKey:["all-items"]});
            queryClient.invalidateQueries({queryKey:["cartitems"]});
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
