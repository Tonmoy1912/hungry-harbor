import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Reviews from "@/models/review/reviewSchema";
import Items from "@/models/item/itemSchema";
import { z } from 'zod';

export async function POST(request) {
    try {
        const body = await request.json();
        const bodySchema = z.object({
            itemId: z.string().trim().min(1)
        });
        const parsedData = bodySchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
        }
        const { itemId } = parsedData.data;
        await mongoose.connect(process.env.MONGO_URL);
        const reviews = await Reviews.findOne({ item: itemId }).select({item:0}).populate({
            path:"user",
            select:"email name "
        });
        if (!reviews) {
            return NextResponse.json({ ok: false, message: "No review." }, { status: 400 });
        }
        return NextResponse.json({ ok: true, reviews:reviews }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 400 });
    }
}