import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"You are not authorized."},{status:400});
        }
        const body=await request.json();
        const _id=body._id;
        await mongoose.connect(process.env.MONGO_URL);
        const order=await Orders.findById(_id).select({
            user:1,
            status:1,
            active:1
        });
        if(!order){
            return NextResponse.json({ok:false,message:"Order doesn't exist"},{status:400});
        }
        if(order.active=='settled'){
            return NextResponse.json({ok:false,message:"A delivered or cancelled order can't be marked as ready."},{status:400});
        }
        order.status="ready";
        order.active="active";
        await order.save();
        sendNotiToSocketServerAndSave({
            userId:order.user,
            message:`Your order with receipt id: ${order._id} is ready.`,
            is_read:false
        });
        fetch(`${process.env.SS_HOST}/api/order/ready`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Pass-Code": process.env.PASS_CODE
            },
            body: JSON.stringify({ _id: order._id, status: order.status, active: order.active, userId: order.user })
        });
        return NextResponse.json({ok:true,message:"Order mark as ready"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}