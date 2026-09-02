import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Orders from "@/models/order/orderSchema";
import Items from "@/models/item/itemSchema";
import { mongoConnect } from "@/config/moongose";
import { itemUpdateSync } from "@/util/item_update_sync";

export async function GET(request) {
    try {
        await mongoConnect();
        const now = new Date();

        // 1. Query initialized, unpaid orders that have passed their expiration timestamp
        const expiredOrders = await Orders.find({
            active: "initialized",
            paid: false,
            expiresAt: { $lte: now }
        }).limit(50);

        if (expiredOrders.length === 0) {
            return NextResponse.json({ ok: true, message: "No expired orders to process." });
        }

        let releasedCount = 0;

        for (const order of expiredOrders) {
            const session = await mongoose.startSession();
            try {
                session.startTransaction();

                // Atomically return stock for all items in this order
                for (const itemEntry of order.items) {
                    await Items.findByIdAndUpdate(
                        itemEntry.item,
                        { $inc: { in_stock: itemEntry.quantity } },
                        { session }
                    );
                }

                // Update order state to 'expired' and status to 'cancelled'
                order.active = "expired";
                order.status = "cancelled";
                await order.save({ session });

                await session.commitTransaction();
                releasedCount++;
            } catch (err) {
                await session.abortTransaction();
                console.error(`Failed to release stock for expired order ${order._id}:`, err);
            } finally {
                session.endSession();
            }
        }

        if (releasedCount > 0) {
            itemUpdateSync(); // Sync real-time inventory to connected users
        }

        return NextResponse.json({
            ok: true,
            message: `Successfully released stock for ${releasedCount} expired order(s).`
        });

    } catch (err) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
}

