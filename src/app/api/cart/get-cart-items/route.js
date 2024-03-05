import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
import Items from "@/models/item/itemSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request){
    try{
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"User not logged in"},{status:400});
        }
        const userId=session.user.id;
        let cart=await Carts.findOne({user:userId}).populate({
            path:"items",
            populate:{
                path:"item",
                select:{
                    name:1,image:1,price:1,category:1,removed:1,rating:1,in_stock:1
                }
            }
        });
        // console.log(cart);
        if(!cart || cart.items.length==0){
            return NextResponse.json({ok:true,items:[]},{status:200});
        }
        
        return NextResponse.json({ok:true,items:cart.items},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}