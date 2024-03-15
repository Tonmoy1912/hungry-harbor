import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ ok: false, message: "You are not authorized." }, { status: 400 });
        }
        const body = await request.json();
        const _id = body._id;
        const cooking_inst_status = body.inst;
        const ready_by = body.ready_by;
        const accepted = body.accepted;
        await mongoose.connect(process.env.MONGO_URL);
        const order = await Orders.findById(_id).select({
            user: 1,
            status: 1,
            active: 1,
            cooking_inst_status: 1,
            ready_by: 1,
            paymentId: 1,
            total_amount: 1,
            refunded: 1
        });
        if (!order) {
            return NextResponse.json({ ok: false, message: "Order doesn't exist" }, { status: 400 });
        }
        if (accepted) {
            order.status = "accepted";
            order.active = "active";
            order.ready_by = ready_by || "";
            order.cooking_inst_status = cooking_inst_status == "accept" ? "accepted" : "rejected";
        }
        else {
            order.status = "cancelled";
            order.active = "settled";
            order.ready_by = ready_by || "";
            order.cooking_inst_status = cooking_inst_status == "accept" ? "accepted" : "rejected";
            if (order.paymentId) {
                let instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
                await instance.payments.refund(order.paymentId, {
                    "amount": order.total_amount * 100,
                    "speed": "normal",
                    "receipt": order._id
                });
            }
            else {
                //no payment id -> cash on delivery
                order.refunded = true;
            }
        }
        await order.save();
        fetch(`${process.env.SS_HOST}/api/order/accept-order`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Pass-Code": process.env.PASS_CODE
            },
            body: JSON.stringify({ _id: order._id, status: order.status, active: order.active, ready_by: order.ready_by, cooking_inst_status: order.cooking_inst_status, userId: order.user })
        });
        return NextResponse.json({ ok: true, message: accepted ? "Order accepted" : "Order rejected" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}