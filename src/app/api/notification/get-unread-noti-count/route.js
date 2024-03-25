import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Notifications from "@/models/notification/notificationSchema";
import {z} from 'zod';
import { mongoConnect } from "@/config/moongose";

export async function GET(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"Unauthorized access"},{status:400});
        }
        const userId=session.user.id;
        await mongoConnect();
        const noti_count=await Notifications.find({user:userId,is_read:false})
        .sort({date:-1})
        .limit(30)
        .countDocuments();
        return NextResponse.json({ok:true,noti_count},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}