import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";

export async function GET(request){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        let data=await Categories.find({});
        return NextResponse.json({ok:true,categories:data,type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
}