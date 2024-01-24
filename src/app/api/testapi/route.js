import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request){
    const session=await getServerSession(authOptions);
    // console.log("session form testapi",session);
    return NextResponse.json({session},{status:200});
}