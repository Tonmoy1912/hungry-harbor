import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Notifications from "@/models/notification/notificationSchema";
import {z} from 'zod';
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"Unauthorized access"},{status:400});
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
        const userId=session.user.id;
        const { page_no, row_per_page } = parsedData.data;
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const notifications=await Notifications.find({user:userId})
        .sort({date:-1})
        .skip(page_no*row_per_page)
        .limit(row_per_page);
        return NextResponse.json({ok:true,notifications:notifications,hasNext:notifications.length==row_per_page},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}