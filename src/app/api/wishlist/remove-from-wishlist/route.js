import { NextResponse } from "next/server";
import WishLists from "@/models/wishList/wishLishSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"User not logged in"},{status:400});
        }
        const body=await request.json();
        const itemId=body.item_id;
        const userId=session.user.id;
        await mongoConnect();
        const res=await WishLists.updateOne({user:userId},{$pull:{items:itemId}});
        // console.log(res);
        if(res.modifiedCount==0){
            return NextResponse.json({ok:false,message:"Item doesn't in wishlist"},{status:400});
        }
        return NextResponse.json({ok:true,message:"Removed from wishlist"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}