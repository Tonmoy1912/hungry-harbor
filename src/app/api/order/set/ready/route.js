import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";

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
        order.status="ready";
        order.active="active";
        await order.save();
        return NextResponse.json({ok:true,message:"Order mark as ready"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}