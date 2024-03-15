import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "You are not authorized." }, { status: 400 });
        }
        const body = await request.json();
        const _id = body._id;
        await mongoose.connect(process.env.MONGO_URL);
        const order = await Orders.findById(_id).select({
            user: 1,
            status: 1,
            active: 1,
            paymentId: 1,
            total_amount: 1,
            refunded: 1
        });
        if (!order) {
            return NextResponse.json({ ok: false, message: "Order doesn't exist" }, { status: 400 });
        }
        else if (order.status == "settled") {
            return NextResponse.json({ ok: false, message: "Settled ordered can't be refunded" }, { status: 400 });
        }
        order.status = "cancelled";
        order.active = "settled";
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
        await order.save();
        return NextResponse.json({ ok: true, message: "Order cancelled successfully" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}