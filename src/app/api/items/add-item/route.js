import { NextResponse } from "next/server";

export async function POST(request){
    try{
        const body=await request.json();
        console.log("body",body);
        return NextResponse.json({ok:true,message:"All ok",type:"Failed"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
    }
}