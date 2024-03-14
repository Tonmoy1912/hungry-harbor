import { NextResponse } from "next/server";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";
import { headers } from "next/headers";
import { createHmac } from "crypto";
import Razorpay from "razorpay";

//always send status=ok and status code=200 to convince the razorpay server that our server is running..

export async function POST(request) {
    let db_session = null;
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

        //first mark the order as paid
        await Orders.updateOne({ orderId: order_id }, { $set: { paymentId: payment_id, paid: true } });

        db_session = await mongoose.startSession();
        db_session.startTransaction();

        const orderData = await Orders.findOne({ orderId: order_id }).session(db_session);
        if (!orderData) {
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        const items = orderData.items;
        let in_stock = true;
        for (let x of items) {
            let dbItem = await Items.findById(x.item).select({ in_stock: 1, price: 1 }).session(db_session);
            if (!dbItem || dbItem.in_stock < x.quantity) {
                //issue refund....
                in_stock = false;
                break;
            }
            else {
                dbItem.in_stock -= x.quantity;
                await dbItem.save();
            }
        }
        if (!in_stock) {
            //abort transaction and issue refund since the order can not be fullfilled due to out of stock items
            await db_session.abortTransaction();
            db_session = null;
            let instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
            await instance.payments.refund(payment_id, {
                "amount": orderData.total_amount*100,
                "speed": "normal",
                "receipt": orderData._id
            });
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
        orderData.paymentId = payment_id;
        orderData.paid = true;
        orderData.payment_failed = false;
        orderData.active="active";
        await orderData.save();
        await db_session.commitTransaction();
        db_session = null;
        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
    }
    catch (err) {
        // console.log("error in payment capture", err);
        try {
            if (db_session) {
                db_session.abortTransaction();
            }
        }
        finally {
            return NextResponse.json({ ok: false, status: "ok" }, { status: 200 });
        }
    }
}