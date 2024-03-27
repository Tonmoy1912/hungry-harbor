import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Orders from "@/models/order/orderSchema";
import Items from "@/models/item/itemSchema";
import Users from "@/models/user/userSchema";
import mongoose from "mongoose";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"You are not authorized."},{status:400});
        }
        const body=await request.json();
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const order=await Orders.findOne({_id:body._id}).select({
            refunded:0,payment_failed:0,refundId:0
        })
        .populate({
            path:"items.item",
            select:"name price"
        })
        .populate({
            path:'user',
            select:"name email phone"
        });
        if(order && order.user!=session.user.id && !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"You are not authorized."},{status:400});
        }
        return NextResponse.json({ok:true,order:order},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}