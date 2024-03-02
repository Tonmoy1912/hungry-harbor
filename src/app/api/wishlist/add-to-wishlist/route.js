import { NextResponse } from "next/server";
import WishLists from "@/models/wishList/wishLishSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"User not logged in"},{status:400});
        }
        const body=await request.json();
        const itemId=body.item_id;
        const userId=session.user.id;
        // console.log(itemId);
        let wishList=await WishLists.findOne({user:userId});
        if(!wishList){
            wishList= new WishLists({user:userId,items:[]});
        }
        let addedData=wishList.items.addToSet(itemId);
        // console.log("added data",addedData);
        if(addedData.length==0){
            return NextResponse.json({ok:false,message:"Item already in wishlist"},{status:400});
        }
        await wishList.save();
        return NextResponse.json({ok:true,message:"Added to wishlist"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}