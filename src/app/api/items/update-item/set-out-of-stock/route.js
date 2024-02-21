import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose, { mongo } from "mongoose";
import Items from "@/models/item/itemSchema";
import { z } from "zod";

export async function POST(request) {
    let db_session=null;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ ok: false, message: "Unauthorized..!", type: "Failed" }, { status: 400 });
        }
        let body = await request.json();
        const BodySchema = z.object({
            id:z.string().trim().min(1)
        });
        const parsedBody = BodySchema.safeParse(body);
        // return NextResponse.json(parsedBody);
        if (!parsedBody.success) {
            return NextResponse.json({ ok: false, message: "Enter valid input", type: "Failed" }, { status: 400 });
        }
        let { id } = parsedBody.data;
        await mongoose.connect(process.env.MONGO_URL);


        //put inside db transaction............................
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        let item=await Items.findById(id).select({in_stock:1}).session(db_session);
        if(!item){
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "No item found", type: "Failed" }, { status: 400 });
        }
        item.in_stock=0;
        await item.save();
        await db_session.commitTransaction();
        //put inside db transaction............................

        
        return NextResponse.json({ ok: true, message: "Successfully set out of stock", type: "Success" }, { status: 200 });
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