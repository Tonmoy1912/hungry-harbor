import { NextResponse } from "next/server";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";
import { headers } from "next/headers";
import { createHmac } from "crypto";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";

//always send status=ok and status code=200 to convince the razorpay server that our server is running..

export async function POST(request) {
    let db_session = null;
    try {
        // console.log("payment refund-processed api called");
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
        const {id:refund_id}=body.payload.refund.entity;
        // console.log("payment id:",payment_id);
        // console.log("order id:",order_id);
        await mongoose.connect(process.env.MONGO_URL);
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        const orderData = await Orders.findOne({ orderId: order_id }).select({items:0}).session(db_session);
        // console.log("orderData",orderData);
        if(!orderData){
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        orderData.paymentId = payment_id;
        orderData.paid = true;
        orderData.payment_failed = false;
        orderData.refundId=refund_id;
        orderData.refunded=true;
        orderData.active="settled";
        orderData.status="cancelled";
        await orderData.save();
        await db_session.commitTransaction();
        db_session=null;
        sendNotiToSocketServerAndSave({
            userId:orderData.user,
            message:`The payment for order with receipt id: ${orderData._id} is refunded.`,
            is_read:false,
            for_owner:false
        })
        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
    }
    catch (err) {
        // console.log("error in refund processed",err);
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