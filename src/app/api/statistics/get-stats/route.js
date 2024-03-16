import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Stats from "@/models/stats/statsSchema";

export async function GET(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session || !session.user.isAdmin){
            return NextResponse.json({ok:false,message:"User is unauthorized."},{status:400});
        }
        await mongoose.connect(process.env.MONGO_URL);
        let curDate = new Date();
        curDate.setHours(0, 0, 0);
        const upperMonthLimit = new Date(curDate);
        curDate.setMonth(curDate.getMonth() - 2);
        const lowerMonthLimit = new Date(curDate);
        // console.log(lowerMonthLimit.toLocaleString());
        // console.log(upperMonthLimit.toLocaleString());
        const stats=await Stats.find({date:{$gte:lowerMonthLimit}}).sort({date:1});
        return NextResponse.json({ok:true,stats},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}