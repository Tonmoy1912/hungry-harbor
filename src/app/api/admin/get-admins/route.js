import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import Owners from "@/models/owner/ownerSchema";

export async function GET(request){
    try{
        // const session=await getServerSession(authOptions);
        // if(!session || !session.user.isAdmin){
        //     return NextResponse.json({ok:false,message:"You are not authorized",type:"Info"},{status:400});
        // }
        await mongoose.connect(process.env.MONGO_URL);
        const admins=await Owners.find({}).populate({
            path:"user",
            select:"name email phone address"
        });
        return NextResponse.json({ok:true,admins:admins,type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
} 