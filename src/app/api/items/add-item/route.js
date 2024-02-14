import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import Items from "@/models/item/itemSchema";
import {z} from "zod";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"Unauthorized..!",type:"Failed"},{status:400});
        }
        let body=await request.json();
        const BodySchema=z.object({
            name:z.string().trim().min(1),
            image:z.string().url(),
            description:z.string().trim(),
            price:z.coerce.number().int().nonnegative(),
            category:z.string().trim().min(1).toUpperCase()
        });
        const parsedBody=BodySchema.safeParse(body);
        // return NextResponse.json(parsedBody);
        if(!parsedBody.success){
            return NextResponse.json({ok:false,message:"Enter valid input",type:"Failed"},{status:400});
        }
        let {name,image,description,price,category}=parsedBody.data;
        await mongoose.connect(process.env.MONGO_URL);
        let db_category=await Categories.findOne({category});
        if(!db_category){
            return NextResponse.json({ok:false,message:"No such category..",type:"Failed"},{status:400});
        }
        let db_item=await Items.findOne({name,removed:false}).select({name:1});
        if(db_item){
            return NextResponse.json({ok:false,message:"The item already exists",type:"Failed"},{status:400});
        }
        let newItem=new Items({name,image,description,price,category});
        await newItem.save();
        db_category.total++;
        await db_category.save();
        return NextResponse.json({ok:true,message:"Item added successfully",item:newItem,type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
    }
}