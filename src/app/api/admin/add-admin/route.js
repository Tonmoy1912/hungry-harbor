import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import Owners from "@/models/owner/ownerSchema";
import Users from "@/models/user/userSchema";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"You are not authorized"},{status:400});
        }
        const body=await request.json();
        let {email}=body;
        email=email.trim();
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const user=await Users.findOne({email:email}).select({name:1,email:1,phone:1,address:1});
        if(!user){
            return NextResponse.json({ok:false,message:"No user found",type:"Failed"},{status:400});
        }
        const admin=await Owners.findOne({email:email}).select({email:1});
        if(admin){
            return NextResponse.json({ok:false,message:"The user is already added as admin",type:"Info"},{status:400});
        }
        const newAdmin=new Owners({user:user._id,email:email});
        await newAdmin.save();
        sendNotiToSocketServerAndSave({
            userId:user._id,
            message:"You are added as admin",
            is_read:false
        });
        return NextResponse.json({ok:true,message:"User added successfully",type:"Success",admin:{user:user,email:email}},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
} 