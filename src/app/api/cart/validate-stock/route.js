import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
import Items from "@/models/item/itemSchema";
import mongoose from "mongoose";
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    try{
        const body=await request.json();
        const {items}=body;
        let in_stock=true;
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        let message="Only";
        for(let x of items){
            let dbItem=await Items.findById(x.item._id).select({in_stock:1});
            if(!dbItem){
                return NextResponse.json({ok:false,items:`${x.item.name} removed by the owner.`},{status:400});
            }
            if(dbItem.in_stock<x.quantity){
                message+=` ${dbItem.in_stock} ${x.item.name},`;
                in_stock=false;
            }
        }
        if(!in_stock){
            message=message.substring(0,message.length-1);
            message+=' in stock';
            return NextResponse.json({ok:false,message:message,type:"Info"},{status:400});
        }
        return NextResponse.json({ok:true,message:"All items in stock"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}
