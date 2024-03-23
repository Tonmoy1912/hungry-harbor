import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Items from "@/models/item/itemSchema";
import WishLists from "@/models/wishList/wishLishSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { mongoConnect } from "@/config/moongose";

export async function GET(request){
    //return all items that are not removed
    try{
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        let items=await Items.find({removed:false}).select({date:0,__v:0});
        const session=await getServerSession(authOptions);
        if(session){
            const userId=session.user.id;
            let wishList=await WishLists.findOne({user:userId});
            if(wishList){
                items=items.map(x=>{
                    let item=x._doc;
                    if(wishList.items.includes(item._id)){
                        return {...item,in_wishlist:true};
                    }
                    else{
                        return {...item,in_wishlist:false};
                    }
                })
            }
        }
        // console.log(items);
        return NextResponse.json({ok:true,items:items},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:500});
    }
}