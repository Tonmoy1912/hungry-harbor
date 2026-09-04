import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import { headers } from "next/headers";
import { createHmac } from "crypto";
import { mongoConnect } from "@/config/moongose";

export async function POST(request) {
    let db_session = null;
    try {
        const razorpaySignature = headers().get('x-razorpay-signature');
        const body = await request.json();
        const shasum = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
        shasum.update(JSON.stringify(body));
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
        }

        const { id: payment_id, order_id } = body.payload.payment.entity;

        await mongoConnect();
        db_session = await mongoose.startSession();
        db_session.startTransaction();

        const orderData = await Orders.findOne({ orderId: order_id, paid: false }).session(db_session);
        if (!orderData || orderData.active === "failed" || orderData.active === "expired") {
            await db_session.abortTransaction();
            db_session.endSession();
            return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
        }

        orderData.paymentId = payment_id;
        orderData.paid = false;
        orderData.payment_failed = true;
        orderData.active = "failed";
        orderData.status = "cancelled";
        orderData.expiresAt = null;
        orderData.required_restoration = true;

        await orderData.save({ session: db_session });
        await db_session.commitTransaction();
        db_session.endSession();
        db_session = null;

        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });
    } catch (err) {
        if (db_session) {
            try {
                await db_session.abortTransaction();
                db_session.endSession();
            } catch (_) {}
        }
        return NextResponse.json({ ok: false, status: "ok", error: err.message }, { status: 500 });
    }
}