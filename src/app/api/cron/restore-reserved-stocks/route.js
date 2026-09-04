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

        // Query orders that require stock restoration (expired, cancelled, or failed)
        const ordersToRelease = await Orders.find({
            required_restoration: true,
            $or: [
                { active: "initialized", expiresAt: { $lte: now } },
                { status: "cancelled" },
                { active: "failed" },
                { active: "expired" }
            ]
        }).limit(50);

        if (ordersToRelease.length === 0) {
            return NextResponse.json({ ok: true, message: "No orders requiring stock restoration." });
        }

        let releasedCount = 0;

        for (const order of ordersToRelease) {
            const session = await mongoose.startSession();
            try {
                session.startTransaction();

                // Atomically return stock for all items in this order
                if (Array.isArray(order.items) && order.items.length > 0) {
                    for (const itemEntry of order.items) {
                        const itemId = itemEntry.item?._id || itemEntry.item;
                        const qty = Number(itemEntry.quantity);
                        if (itemId && qty > 0) {
                            await Items.findByIdAndUpdate(
                                itemId,
                                { $inc: { in_stock: qty } },
                                { session }
                            );
                        }
                    }
                }

                // If it was an initialized order that timed out, update state
                if (order.active === "initialized") {
                    order.active = "expired";
                    order.status = "cancelled";
                }

                // Mark order stock as restored
                order.required_restoration = false;
                await order.save({ session });

                await session.commitTransaction();
                releasedCount++;
            } catch (err) {
                await session.abortTransaction();
                console.error(`Failed to release stock for order ${order._id}:`, err);
            } finally {
                session.endSession();
            }
        }

        if (releasedCount > 0) {
            itemUpdateSync(); // Sync real-time inventory to connected users
        }

        return NextResponse.json({
            ok: true,
            message: `Successfully released stock for ${releasedCount} order(s).`
        });

    } catch (err) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
}

