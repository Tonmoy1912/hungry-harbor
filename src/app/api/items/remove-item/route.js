import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import Items from "@/models/item/itemSchema";
import { mongoConnect } from "@/config/moongose";
import semaphoreForItem from "@/concurrency-control/semaphores/semaphoreForItem";

export async function POST(request){
    let db_session=null;
    let isLocked=false;
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"Unauthorized..!",type:"Failed"},{status:400});
        }
        let body=await request.json();
        let {name}=body;
        name=name.trim();
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        isLocked=await semaphoreForItem.acquire();
        if(!isLocked){
            return NextResponse.json({ok:false,message:"Failed to acquire the lock"},{status:429});
        }
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        let db_item=await Items.findOne({name,removed:false}).select({name:1,removed:1,category:1,in_stock:1}).session(db_session);
        if(!db_item){
            db_session.abortTransaction();
            return NextResponse.json({ok:false,message:"No such item",type:"Failed"},{status:400});
        }
        let db_category=await Categories.findOne({category:db_item.category}).session(db_session);
        //logically remove the item.. because the item may exits in some one's cart or wishlist
        db_item.removed=true;
        db_item.in_stock=0;
        db_category.total--;
        await db_category.save();
        await db_item.save();
        await db_session.commitTransaction();
        db_session=null;
        semaphoreForItem.release();
        isLocked=false;
        return NextResponse.json({ok:true,message:"Item removed successfully",type:"Success"},{status:200});
    }
    catch(err){
        try{
            if(db_session){
                db_session.abortTransaction();
            }
            if(isLocked){
                semaphoreForItem.release();
            }
        }
        finally{
            return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
        }
    }
}