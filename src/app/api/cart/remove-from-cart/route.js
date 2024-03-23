import { NextResponse } from "next/server";
import Carts from "@/models/cart/cartSchema";
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
        const res=await Carts.updateOne({user:userId},{$pull:{items:{item:itemId}}});
        // console.log(res);
        if(res.modifiedCount==0){
            return NextResponse.json({ok:false,message:"Item doesn't in cart"},{status:400});
        }
        return NextResponse.json({ok:true,message:"Removed from cart"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}

// export async function GET(request){
//     //for testing
//     try{
//         const itemId="65d231a92a0184bdff61f9f5";
//         const userId="65b14ecc59345eecedd0c4c1";
//         const res=await Carts.updateOne({user:userId},{$pull:{items:{item:itemId}}});
//         console.log(res);
//         if(res.modifiedCount==0){
//             return NextResponse.json({ok:false,message:"Item doesn't in cart"},{status:400});
//         }
//         return NextResponse.json({ok:true,message:"Removed from cart"},{status:200});
//     }
//     catch(err){
//         return NextResponse.json({ok:false,message:err.message},{status:500});
//     }
// }