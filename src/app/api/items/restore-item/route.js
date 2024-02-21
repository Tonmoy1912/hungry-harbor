import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import Items from "@/models/item/itemSchema";
import { z } from "zod";

export async function POST(request) {
    let db_sessoin=null;
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
        db_sessoin= await mongoose.startSession();
        db_sessoin.startTransaction();
        const item=await Items.findById(id).select({name:1,category:1,removed:1}).session(db_sessoin);
        if(!item || !item.removed){
            db_sessoin.abortTransaction();
            return  NextResponse.json({ ok: false, message: "No such removed item exist.", type: "Failed" }, { status: 400 });
        }
        const extraItem=await Items.findOne({name:item.name,removed:false}).select({name:1}).session(db_sessoin);
        if(extraItem){
            await db_sessoin.abortTransaction();
            return  NextResponse.json({ ok: false, message: "A item with same name already exists.", type: "Failed" }, { status: 400 });
        }
        const category=await Categories.findOne({category:item.category}).session(db_sessoin);
        if(!category){
            await db_sessoin.abortTransaction();
            return NextResponse.json({ ok: false, message: "No such category  exists the item have.", type: "Failed" }, { status: 400 });
        }
        item.removed=false;
        category.total++;
        await item.save();
        await category.save();
        await db_sessoin.commitTransaction();
        return NextResponse.json({ ok: true, message: "Item restored successfully", type: "Success" }, { status: 200 });
    }
    catch (err) {
        try{
            if(db_sessoin){
                await db_sessoin.abortTransaction();
            }
        }
        finally{
            return NextResponse.json({ ok: false, message: err.message, type: "Failed" }, { status: 400 });
        }
    }
}