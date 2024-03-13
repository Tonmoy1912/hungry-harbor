import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import jwt from 'jsonwebtoken';

export async function GET(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,token:""},{status:400});
        }
        const token=jwt.sign({_id:session.user.id},process.env.SOCKENT_CONNECT_SECRET);
        return NextResponse.json({ok:true,token:token},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,token:""},{status:500});
    }
}