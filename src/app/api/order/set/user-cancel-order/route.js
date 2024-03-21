import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import Razorpay from "razorpay";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "You are not authorized." }, { status: 400 });
        }
        const body = await request.json();
        const _id = body._id;
        await mongoose.connect(process.env.MONGO_URL);
        const order = await Orders.findOne({_id:_id,user:session.user.id}).select({
            user: 1,
            status: 1,
            active: 1,
            paymentId: 1,
            total_amount: 1,
            refunded: 1
        })
        .populate({
            path:"user",
            select:"name phone"
        })
        if (!order) {
            return NextResponse.json({ ok: false, message: "Order doesn't exist" }, { status: 400 });
        }
        else if (order.status == "settled") {
            return NextResponse.json({ ok: false, message: "Settled ordered can't be cancelled." }, { status: 400 });
        }
        else if(order.status != "pending"){
            return NextResponse.json({ ok: false, message: "Only pending orders can be cancelled." }, { status: 400 });
        }
        order.status = "cancelled";
        order.active = "settled";
        if (order.paymentId) {
            let instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
            let refund_status=await instance.payments.refund(order.paymentId, {
                "amount": order.total_amount * 100,
                "speed": "normal",
                "receipt": order._id
            });
            // console.log("refund status",refund_status);
        }
        else {
            //no payment id -> cash on delivery
            order.refunded = true;
        }
        await order.save();
        //send to owner
        sendNotiToSocketServerAndSave({
            message:`A user with name: ${order.user.name} and phone ${order.user.phone} has cancelled his order with receipt id : ${order._id}`,
            is_read:false,
            for_owner:true
        });
        sendNotiToSocketServerAndSave({
            userId:order.user,
            message:`Your order with receipt id : ${order._id} is cancelled. ${order.refunded && "The money will be refunded within 5-7 working days."}`,
            is_read:false
        });
        fetch(`${process.env.SS_HOST}/api/order/user-cancel-order`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Pass-Code": process.env.PASS_CODE
            },
            body: JSON.stringify({ _id: order._id, status: order.status, active: order.active, userId: order.user,refunded:order.refunded  })
        });
        return NextResponse.json({ ok: true, message: "Order cancelled successfully" }, { status: 200 });
    }
    catch (err) {
        // console.log(err);
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}