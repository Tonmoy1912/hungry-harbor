import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Razorpay from "razorpay";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";
import Items from "@/models/item/itemSchema";
import { mongoConnect } from "@/config/moongose";
import { getOpeningTime } from "@/components/shop-open-close-components/shop-open-close-server-component";
import { itemUpdateSync } from "@/util/item_update_sync";

const RESERVATION_EXPIRY_MINUTES = Number(process.env.RESERVATION_EXPIRY_MINUTES??"10");

export async function POST(request) {
    let db_session = null;
    let createdOrderId = null;
    let reservedItems = [];

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in" }, { status: 401 });
        }

        const openingtime = await getOpeningTime();
        if (openingtime) {
            return NextResponse.json({ ok: false, message: "The shop is currently closed. You cannot make any order now." }, { status: 400 });
        }

        const body = await request.json();
        let { items, cooking_instruction } = body;
        cooking_instruction = !cooking_instruction ? "" : cooking_instruction.trim();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ ok: false, message: "Cart items cannot be empty." }, { status: 400 });
        }

        await mongoConnect();
        db_session = await mongoose.startSession();
        db_session.startTransaction();

        const expiresAt = new Date(Date.now() + RESERVATION_EXPIRY_MINUTES * 60 * 1000);
        let total_amount = 0;
        let outOfStockMessage = "";
        const orderItems = [];

        // 1. Atomically deduct stock for each item inside the transaction
        for (const x of items) {
            const itemId = x.item._id || x.item;
            const requestedQty = Number(x.quantity);

            // Conditional decrement: only decrements if available in_stock >= requestedQty
            const dbItem = await Items.findOneAndUpdate(
                { _id: itemId, in_stock: { $gte: requestedQty }, removed: { $ne: true } },
                { $inc: { in_stock: -requestedQty } },
                { session: db_session, new: true }
            );

            if (!dbItem) {
                // Determine remaining stock for user message
                const currentItem = await Items.findById(itemId).session(db_session);
                const available = currentItem ? currentItem.in_stock : 0;
                const itemName = x.item.name || (currentItem ? currentItem.name : "Item");
                outOfStockMessage = currentItem
                    ? `Only ${available} "${itemName}" left in stock.`
                    : `Item was removed by the owner.`;
                break;
            }

            total_amount += dbItem.price * requestedQty;
            reservedItems.push({ itemId: dbItem._id, quantity: requestedQty });
            orderItems.push({ item: dbItem._id, quantity: requestedQty });
        }

        // If any item failed stock check, abort transaction and rollback
        if (outOfStockMessage) {
            await db_session.abortTransaction();
            db_session.endSession();
            db_session = null;
            return NextResponse.json({ ok: false, message: outOfStockMessage, type: "Info" }, { status: 400 });
        }

        // 2. Create and save the Order document with active = "initialized"
        const orderData = new Orders({
            user: session.user.id,
            items: orderItems,
            total_amount: total_amount,
            cooking_instruction: cooking_instruction,
            expiresAt: expiresAt,
            active: "initialized",
            status: "pending",
            paid: false,
            required_restoration: true
        });

        await orderData.save({ session: db_session });
        createdOrderId = orderData._id;

        // 3. Commit DB transaction FIRST before making external Razorpay network call
        await db_session.commitTransaction();
        db_session.endSession();
        db_session = null;

        // Broadcast updated stock to all connected clients
        itemUpdateSync();

        // 4. Create Razorpay order with the committed order._id as receipt
        let razorpayOrder;
        try {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_SECRET
            });

            razorpayOrder = await razorpay.orders.create({
                amount: Math.round(total_amount * 100),
                currency: "INR",
                receipt: createdOrderId.toString()
            });

            if (!razorpayOrder || razorpayOrder.error) {
                throw new Error(razorpayOrder?.error?.description || "Razorpay order creation failed");
            }
        } catch (gatewayErr) {
            // Mark order as failed and cancelled with required_restoration; release cron will restore stock
            await Orders.findByIdAndUpdate(createdOrderId, {
                $set: { active: "failed", status: "cancelled", required_restoration: true }
            });

            return NextResponse.json({
                ok: false,
                message: "Unable to initialize payment gateway. Order cancelled.",
                error: gatewayErr.message
            }, { status: 502 });
        }

        // 5. Update the committed Order with the Razorpay order ID
        await Orders.findByIdAndUpdate(createdOrderId, { $set: { orderId: razorpayOrder.id } });

        const user = await Users.findById(session.user.id).select({ name: 1, email: 1, phone: 1 });

        return NextResponse.json({
            ok: true,
            message: "Order initialized and stock reserved",
            order: razorpayOrder,
            user: user,
            expiresAt: expiresAt,
            key: process.env.RAZORPAY_KEY_ID
        }, { status: 200 });

    } catch (err) {
        if (db_session) {
            try {
                await db_session.abortTransaction();
                db_session.endSession();
            } catch (_) {}
        }
        return NextResponse.json({ ok: false, message: err.message || "Internal server error", type: "Failed" }, { status: 500 });
    }
}