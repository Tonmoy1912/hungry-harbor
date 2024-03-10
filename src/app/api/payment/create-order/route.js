import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Razorpay from "razorpay";
import Users from "@/models/user/userSchema";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in" }, { status: 400 });
        }
        const body = await request.json();
        const { items } = body;
        let in_stock = true;
        await mongoose.connect(process.env.MONGO_URL);
        let message = "Only";
        let total_amount = 0;
        for (let x of items) {
            let dbItem = await Items.findById(x.item._id).select({ in_stock: 1 });
            if (!dbItem) {
                return NextResponse.json({ ok: false, items: `${x.item.name} removed by the owner.` }, { status: 400 });
            }
            if (dbItem.in_stock < x.quantity) {
                message += ` ${dbItem.in_stock} ${x.item.name},`;
                in_stock = false;
            }
            else {
                //logic to create order document
                total_amount += x.item.price * x.quantity;
            }
        }
        if (!in_stock) {
            message = message.substring(0, message.length - 1);
            message += ' in stock';
            return NextResponse.json({ ok: false, message: message, type: "Info" }, { status: 400 });
        }
        const user = await Users.findById(session.user.id).select({ name: 1, email: 1, phone: 1 });
        //save temp order document in database and create a order 
        let razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
        const order = await razorpay.orders.create({
            amount: total_amount * 100,
            currency: "INR",
            receipt: "receipt#1"//put the _id of order document
        });
        if (order.error) {
            return NextResponse.json({ ok: false, message: "Error while creating order.", type: "Error", error: order.error}, { status: 400 });
        }
        return NextResponse.json({ ok: true, message: "Order created", order: order, user: user, key:process.env.RAZORPAY_KEY_ID  }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}