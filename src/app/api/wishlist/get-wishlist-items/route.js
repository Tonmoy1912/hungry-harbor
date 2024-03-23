import { NextResponse } from "next/server";
import WishLists from "@/models/wishList/wishLishSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Items from "@/models/item/itemSchema";
import { mongoConnect } from "@/config/moongose";

export async function GET(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"User not logged in"},{status:400});
        }
        const userId=session.user.id;
        await mongoConnect();
        let wishList=await WishLists.findOne({user:userId}).populate({
            path:"items",
            // select:"-global_order -category_order"
            select:{
                global_order:0,
                category_order:0,
                date:0,
                __v:0
            }
        });
        
        return NextResponse.json({ok:true,items:!wishList?[]:wishList.items},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}