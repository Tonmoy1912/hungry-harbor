import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"Unauthorized..!",type:"Failed"},{status:400});
        }
        let body=await request.json();
        let {category}=body;
        category=category.trim();
        if(category==""){
            return NextResponse.json({ok:false,message:"Enter valid category",type:"Failed"},{status:400});
        }
        await mongoose.connect(process.env.MONGO_URL);
        let data=await Categories.findOne({category});
        if(!data){
            return NextResponse.json({ok:false,message:"No such category",type:"Failed"},{status:400});
        }
        if(data.total>0){
            return NextResponse.json({ok:false,message:`The category can't be removed since ${data.total} items there under this category`,type:"Failed"},{status:400});
        }
        const deletionInfo=await Categories.deleteOne({category});
        return NextResponse.json({ok:true,message:"Category removed successfully",type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
}