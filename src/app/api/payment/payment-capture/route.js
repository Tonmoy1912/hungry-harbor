import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHmac } from "crypto";
import Razorpay from "razorpay";
import Orders from "@/models/order/orderSchema";
import { itemUpdateSync } from "@/util/item_update_sync";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";
import { sendEventToSocketServer } from "@/util/send_event";
import { mongoConnect } from "@/config/moongose";

// Always send status=ok and status code=200/500 as per webhook requirements
export async function POST(request) {
    try {
        const razorpaySignature = headers().get('x-razorpay-signature');
        const body = await request.json();

        // 1. Verify Razorpay Webhook HMAC Signature
        const shasum = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
        shasum.update(JSON.stringify(body));
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            return NextResponse.json({ ok: false, status: "invalid_signature" }, { status: 200 });
        }

        const { id: payment_id, order_id } = body.payload.payment.entity;

        await mongoConnect();

        // 2. Find the initialized order
        const orderData = await Orders.findOne({ orderId: order_id });
        if (!orderData) {
            return NextResponse.json({ ok: false, status: "order_not_found" }, { status: 200 });
        }

        // 3. Idempotency Check: Already paid and active
        if (orderData.paid && orderData.active === "active") {
            return NextResponse.json({ ok: true, status: "already_processed" }, { status: 200 });
        }

        // 4. Handle Edge Case: Order was already expired before payment webhook arrived
        if (orderData.active === "expired" || (orderData.expiresAt && new Date() > orderData.expiresAt)) {
            // Issue automatic refund via Razorpay
            const instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_SECRET
            });

            await instance.payments.refund(payment_id, {
                amount: Math.round(orderData.total_amount * 100),
                speed: "normal",
                receipt: orderData._id.toString(),
                notes: { reason: "Payment received after reservation expired." }
            });

            orderData.paymentId = payment_id;
            orderData.refunded = true;
            await orderData.save();

            sendNotiToSocketServerAndSave({
                userId: orderData.user,
                message: `Payment for order #${orderData._id} was received after the reservation expired. The full amount has been refunded.`,
                is_read: false
            });

            return NextResponse.json({ ok: true, status: "refunded_due_to_expiry" }, { status: 200 });
        }

        // 5. Normal Success Flow: Confirm Order
        orderData.paymentId = payment_id;
        orderData.paid = true;
        orderData.payment_failed = false;
        orderData.active = "active";
        orderData.status = "pending";
        orderData.expiresAt = null; // Clear expiration timestamp

        await orderData.save();

        // 6. Real-time notifications and socket events
        itemUpdateSync();
        sendEventToSocketServer("/api/order/new-order", { _id: orderData._id });
        sendNotiToSocketServerAndSave({
            userId: orderData.user,
            message: `Your order #${orderData._id} has been placed successfully!`,
            is_read: false
        });

        return NextResponse.json({ ok: true, status: "ok" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ ok: false, status: "error", error: err.message }, { status: 500 });
    }
}