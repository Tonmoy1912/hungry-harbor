import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Items from "@/models/item/itemSchema";


export async function GET(request) {
    //return all items that are not removed
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const items = await Items.find({ removed: true }).select({ name: 1, category: 1, image: 1, rating: 1, total_review: 1,price:1 });
        return NextResponse.json({ ok: true, items: items }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 500 });
    }

}