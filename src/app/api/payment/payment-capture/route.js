import { NextResponse } from "next/server";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";
import { headers } from "next/headers";
import { createHmac } from "crypto";

//always send status=ok and status code=200 to convince the razorpay server that our server is running..

export async function POST(request) {
    try {
        // console.log("payment captured api called");
        const razorpaySignature = headers().get('x-razorpay-signature');
        const body = await request.json();
        // console.log("body",body);
        const shasum = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
        shasum.update(JSON.stringify(body));
        const digest = shasum.digest('hex');
        if (digest != razorpaySignature) {
            // console.log("returned due to validation failed");
            // console.log("digest",digest);
            // console.log("razorpaySignature",razorpaySignature);
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        //the request is made from Razorpay..
        //Now write the backend logic
        const { id: payment_id, order_id } = body.payload.payment.entity;
        // console.log("payment id:", payment_id);
        // console.log("order id:", order_id);
        await mongoose.connect(process.env.MONGO_URL);
        const orderData = await Orders.findOne({ orderId: order_id, paid:false }).select({ items: 0 });
        if(!orderData){
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        orderData.paymentId = payment_id;
        orderData.paid = true;
        orderData.payment_failed = false;
        await orderData.save();
        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
    }
    catch (err) {
        // console.log(err);
        return NextResponse.json({ ok: false, message: err.message, type: "Failed", status: "ok" }, { status: 200 });
    }
}