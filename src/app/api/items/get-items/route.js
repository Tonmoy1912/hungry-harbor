import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Items from "@/models/item/itemSchema";


export async function GET(request){
    //return all items that are not removed
    try{
        await mongoose.connect(process.env.MONGO_URL);
        const items=await Items.find({removed:false});
        return NextResponse.json({ok:true,items:items},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:5000});
    }
}