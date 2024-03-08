import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Reviews from "@/models/review/reviewSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Items from "@/models/item/itemSchema";
import Users from "@/models/user/userSchema";
import { z } from 'zod';

export async function POST(request) {
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        const bodySchema = z.object({
            itemId: z.string().trim().min(1),
            page_no: z.coerce.number().int(),
            row_per_page: z.coerce.number().int().positive()
        });
        const parsedData = bodySchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
        }
        const { itemId, page_no, row_per_page } = parsedData.data;
        await mongoose.connect(process.env.MONGO_URL);
        // const reviews = await Reviews.findOne({ item: itemId }).select({item:0}).populate({
        //     path:"user",
        //     select:"email name "
        // });
        let reviews = [];
        if (page_no == 0 && session) {
            let data = await Reviews.findOne({ user: session.user.id, item: itemId }).select({ item: 0 }).populate({
                path: "user",
                select: "email name "
            });
            if (data) {
                reviews.push(data);
                data = await Reviews.find({$and:[{item:itemId},{user:{$not:{$eq:session.user.id}}}]})
                .sort({rating:-1,date:-1})
                .limit(row_per_page - 1 )
                .select({ item: 0 }).populate({
                    path: "user",
                    select: "email name "
                });
                reviews=reviews.concat(data);
            }
            else{
                data = await Reviews.find({item:itemId})
                .sort({rating:-1,date:-1})
                .limit(row_per_page)
                .select({ item: 0 }).populate({
                    path: "user",
                    select: "email name "
                });
                reviews=reviews.concat(data);
            }
        }
        else{
            reviews= await Reviews.find({item:itemId})
            .sort({rating:-1,date:-1})
            .skip(page_no*row_per_page)
            .limit(row_per_page)
            .select({ item: 0 }).populate({
                path: "user",
                select: "email name "
            });
        }
        return NextResponse.json({ ok: true, reviews: reviews, hasNext:reviews.length==row_per_page }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 400 });
    }
}