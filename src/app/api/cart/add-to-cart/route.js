import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
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
        const toBuy=body.toBuy;
        const userId=session.user.id;
        await mongoose.connect(process.env.MONGO_URL);
        let item=await Items.findById(itemId).select({name:1});
        if(!item){
            return NextResponse.json({ok:false,message:"The item doesn't exist."},{status:400});
        }
        // console.log(itemId);
        let cart=await Carts.findOne({user:userId});
        if(!cart){
            cart= new Carts({user:userId,items:[]});
        }
        let isPresent=false;
        for (let x of cart.items){
            if(x.item==itemId){
                isPresent=true;
                break;
            }
        }
        if(isPresent && !toBuy){
            return NextResponse.json({ok:false,message:"The item already in cart"},{status:400});
        }
        if(!isPresent){
            cart.items.push({item:itemId,quantity:1});   
            await cart.save();
        }
        if(toBuy){
            return NextResponse.json({ok:true,message:"Redirect to cart"},{status:200});
        }
        return NextResponse.json({ok:true,message:"Added to cart"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}