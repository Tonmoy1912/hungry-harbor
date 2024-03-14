import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Razorpay from "razorpay";
import Users from "@/models/user/userSchema";
import Orders from "@/models/order/orderSchema";

export async function POST(request) {
    let db_session = null;
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in" }, { status: 400 });
        }
        const body = await request.json();
        let { items, cooking_instruction } = body;
        cooking_instruction=!cooking_instruction?"":cooking_instruction.trim();
        let in_stock = true;
        await mongoose.connect(process.env.MONGO_URL);
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        let message = "Only";
        let total_amount = 0;
        const orderData=new Orders({user:session.user.id,total_amount:0,cooking_instruction:cooking_instruction});
        for (let x of items) {
            let dbItem = await Items.findById(x.item._id).select({ in_stock: 1, price:1 }).session(db_session);
            if (!dbItem) {
                await db_session.abortTransaction();
                return NextResponse.json({ ok: false, items: `${x.item.name} removed by the owner.` }, { status: 400 });
            }
            if (dbItem.in_stock < x.quantity) {
                message += ` ${dbItem.in_stock} ${x.item.name},`;
                in_stock = false;
            }
            else {
                //logic to create order document
                total_amount += dbItem.price * x.quantity;
                // dbItem.in_stock-=x.quantity;
                // await dbItem.save();
                orderData.items.push({item:dbItem._id,quantity:x.quantity});
            }
        }
        if (!in_stock) {
            message = message.substring(0, message.length - 1);
            message += ' in stock';
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: message, type: "Info" }, { status: 400 });
        }
        const user = await Users.findById(session.user.id).select({ name: 1, email: 1, phone: 1 }).session(db_session);
        //save temp order document in database and create a order 
        let razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
        const order = await razorpay.orders.create({
            amount: total_amount * 100,
            currency: "INR",
            receipt: orderData._id //put the _id of order document
        });
        if (order.error) {
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "Error while creating order.", type: "Error", error: order.error}, { status: 400 });
        }
        orderData.orderId=order.id;
        orderData.total_amount=total_amount;
        //orderData.paymentId will be added when payment captured or failed
        await orderData.save();
        await db_session.commitTransaction();
        db_session=null;
        return NextResponse.json({ ok: true, message: "Order created", order: order, user: user, key:process.env.RAZORPAY_KEY_ID  }, { status: 200 });
    }
    catch (err) {
        try{
            if(db_session){
                db_session.abortTransaction();
            }
        }
        finally{
            return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
        }
    }
}