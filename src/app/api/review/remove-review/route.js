import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Reviews from "@/models/review/reviewSchema";
import Items from "@/models/item/itemSchema";
import { z } from 'zod';

export async function POST(request) {
    let db_session = null;
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in." }, { status: 400 });
        }
        const userId = session.user.id;
        //for testing
        // const userId="65b14ecc59345eecedd0c4c1";

        const bodySchema = z.object({
            reviewId: z.string().trim().min(1)
        });
        const parsedData = bodySchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
        }
        const { reviewId } = parsedData.data;
        await mongoose.connect(process.env.MONGO_URL);
        db_session = await mongoose.startSession();
        db_session.startTransaction();
        const prevReview = await Reviews.findById(reviewId).session(db_session);
        if (prevReview.user != userId && !session.user.isAdmin) {
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "Unauthorized action." }, { status: 400 });
        }
        const item = await Items.findById(prevReview.item).select({ total_review: 1, rating: 1 }).session(db_session);
        if(!item){
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "Item doesn't exist." }, { status: 400 });
        }
        let total_rating = item.total_review * item.rating;
        item.total_review--;
        if(item.total_review==0){
            item.rating=0;
        }
        else{
            item.rating = (total_rating - prevReview.rating ) / item.total_review;
        }
        await item.save();
        await Reviews.findByIdAndDelete(reviewId).session(db_session);
        await db_session.commitTransaction();
        db_session=null;
        return NextResponse.json({ ok: true, message: "Review deleted successfully." }, { status: 200 });
    }
    catch (err) {
        try {
            if (db_session) {
                await db_session.abortTransaction();
            }
        }
        finally {
            return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 400 });
        }
    }
}