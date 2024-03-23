import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Notifications from "@/models/notification/notificationSchema";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"Unauthorized access"},{status:400});
        }
        const body=await request.json();//body={_id}
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const updateData=await Notifications.updateOne({_id:body._id,user:session.user.id},{$set:{is_read:true}});
        return NextResponse.json({ok:true,message:"Mark as read"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}