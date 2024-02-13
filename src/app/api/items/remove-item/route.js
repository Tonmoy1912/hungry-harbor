import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import Items from "@/models/item/itemSchema";

export async function POST(request){
    try{
        // const session=await getServerSession(authOptions);
        // if(!session || !session.user.isAdmin){
        //     return NextResponse.json({ok:false,message:"Unauthorized..!",type:"Failed"},{status:400});
        // }
        let body=await request.json();
        let {name}=body;
        name=name.trim();
        await mongoose.connect(process.env.MONGO_URL);
        let db_item=await Items.findOne({name,removed:false}).select({name:1,removed:1,category:1});
        if(!db_item){
            return NextResponse.json({ok:false,message:"No such item",type:"Failed"},{status:400});
        }
        let db_category=await Categories.findOne({category:db_item.category});
        //logically remove the item.. because the item may exits in some one's cart or wishlist
        db_item.removed=true;
        db_category.total--;
        await db_category.save();
        await db_item.save();
        return NextResponse.json({ok:true,message:"Item removed successfully",type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
    }
}