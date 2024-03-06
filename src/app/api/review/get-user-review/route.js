import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Reviews from "@/models/review/reviewSchema";
import Items from "@/models/item/itemSchema";
import { z } from 'zod';

export async function POST(request) {
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in." }, { status: 400 });
        }
        const userId = session.user.id;
        //for testing
        // const userId = "65b14ecc59345eecedd0c4c1";

        const bodySchema = z.object({
            itemId: z.string().trim().min(1)
        });
        const parsedData = bodySchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
        }
        const { itemId } = parsedData.data;
        await mongoose.connect(process.env.MONGO_URL);
        const review = await Reviews.findOne({ user: userId, item: itemId });
        if (!review) {
            return NextResponse.json({ ok: false, message: "No review." }, { status: 400 });
        }
        return NextResponse.json({ ok: true, review:review }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 400 });
    }
}