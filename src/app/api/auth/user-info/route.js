import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import { mongoConnect } from "@/config/moongose";

export async function GET(){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,session:null},{status:200});
        }
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const user=await Users.findById(session.user.id).select("name email avatar phone address");
        // console.log("User data on server",user);
        return NextResponse.json({ok:true,userData:user},{status:200});
    }
    catch(err){
        // console.log("returning error")
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}