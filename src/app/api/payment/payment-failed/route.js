import { NextResponse } from "next/server";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";
import { headers } from "next/headers";
import { createHmac } from "crypto";
import { mongoConnect } from "@/config/moongose";

//always send status=ok and status code=200 to convince the razorpay server that our server is running..

export async function POST(request) {
    let db_session = null;
    try {
        // console.log("payment failed api called");
        const razorpaySignature = headers().get('x-razorpay-signature');
        const body=await request.json();
        const shasum = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
        shasum.update(JSON.stringify(body));
        const digest = shasum.digest('hex');
        if(digest!=razorpaySignature){
            // console.log("returned due to validation failed");
            return NextResponse.json({ok:true,status:"ok"},{status:200});
        }
        //the request is made from Razorpay..
        //Now write the backend logic
        const {id:payment_id, order_id}=body.payload.payment.entity;
        // console.log("payment id:",payment_id);
        // console.log("order id:",order_id);
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        const orderData = await Orders.findOne({ orderId: order_id, paid:false, payment_failed:false }).select({items:0}).session(db_session);
        // console.log("orderData",orderData);
        if(!orderData){
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        // const items=orderData.items;
        //add the ordered items back to stock
        // for(let x of items){
        //     let dbItem = await Items.findById(x.item._id).select({ in_stock: 1 }).session(db_session);
        //     if(dbItem){
        //         dbItem.in_stock+=x.quantity;
        //         await dbItem.save();
        //     }
        // }
        // await Orders.deleteOne({orderId:order_id});
        orderData.paymentId = payment_id;
        orderData.paid = false;
        orderData.payment_failed = true;
        await orderData.save();
        await db_session.commitTransaction();
        db_session=null;
        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
    }
    catch (err) {
        // console.log("error in payment failed",err);
        try{
            if(db_session){
                db_session.abortTransaction();
            }
        }
        finally{
            return NextResponse.json({ok:false,status:"ok"},{status:200});
        }
    }
}