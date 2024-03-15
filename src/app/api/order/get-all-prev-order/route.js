import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Orders from "@/models/order/orderSchema";
import Items from "@/models/item/itemSchema";
import Users from "@/models/user/userSchema";
import mongoose from "mongoose";
import { z } from 'zod';

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"You are not authorized."},{status:400});
        }
        const body=await request.json();
        const bodySchema = z.object({
            page_no: z.coerce.number().int().nonnegative(),
            row_per_page: z.coerce.number().int().positive()
        });
        const parsedData = bodySchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
        }
        const { page_no, row_per_page } = parsedData.data;
        await mongoose.connect(process.env.MONGO_URL);
        const orders=await Orders.find({active:"settled"})
        .sort({date:-1})
        .skip(page_no*row_per_page)
        .limit(row_per_page)
        .select({
            payment_failed:0,cooking_instruction:0
        })
        .populate({
            path:"items.item",
            select:"name price"
        })
        .populate({
            path:'user',
            select:"name email phone"
        });
        return NextResponse.json({ok:true,orders:orders,hasNext:orders.length==row_per_page},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}