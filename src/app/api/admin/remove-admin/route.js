import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";
import Owners from "@/models/owner/ownerSchema";
import Users from "@/models/user/userSchema";
import { sendNotiToSocketServerAndSave } from "@/util/send_notification";

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
            const deletedUser=await Users.findOne({email:email}).select({_id:1});
            if(deletedUser){
                sendNotiToSocketServerAndSave({
                    userId:deletedUser._id,
                    message:"You are remove from admin",
                    is_read:false
                });
            }
            return NextResponse.json({ok:false,message:"No admin with the given email",type:"Info"},{status:400});
        }
        return NextResponse.json({ok:true,message:"User is remove from admin",type:"Success"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
} 