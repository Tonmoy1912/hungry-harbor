import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import Owners from "@/models/owner/ownerSchema";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"You are not authorized",type:"Info"},{status:400});
        }
        let body=await request.json();
        let {email}=body;
        email=email.trim();
        if(email==process.env.DEVELOPER){
            return NextResponse.json({ok:false,message:"You can't remove the developer",type:"Info"},{status:400});
        }
        await mongoose.connect(process.env.MONGO_URL);
        const result=await Owners.deleteOne({email:email});
        if(result.deletedCount==0){
            return NextResponse.json({ok:false,message:"No admin with the given email",type:"Info"},{status:400});
        }
        return NextResponse.json({ok:true,message:"User is remove from admin",type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
} 