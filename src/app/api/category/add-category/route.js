import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"Unauthorized..!",type:"Failed"},{status:400});
        }
        let body=await request.json();
        let {category}=body;
        category=category.trim().toUpperCase();
        if(category==""){
            return NextResponse.json({ok:false,message:"Enter valid category",type:"Failed"},{status:400});
        }
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        let data=await Categories.findOne({category});
        if(data){
            return NextResponse.json({ok:false,message:"The category all ready exists",type:"Failed"},{status:400});
        }
        let newCategory=new Categories({category});
        await newCategory.save();
        return NextResponse.json({ok:true,message:"Category added successfully",type:"Success",category:newCategory},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
}