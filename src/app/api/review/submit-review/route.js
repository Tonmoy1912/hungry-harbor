import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Reviews from "@/models/review/reviewSchema";
import Items from "@/models/item/itemSchema";
import Users from "@/models/user/userSchema";
import  {z} from 'zod';
import { mongoConnect } from "@/config/moongose";

export async function POST(request){
    let db_session=null;
    try{
        const body=await request.json();
        const session=await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ok:false,message:"User not logged in."},{status:400});
        }
        const userId=session.user.id;
        //for testing
        // const userId="65b14ecc59345eecedd0c4c1";

        const bodySchema=z.object({
            itemId:z.string().trim().min(1),
            review:z.string().trim(),
            rating:z.coerce.number().int().positive().max(5)
        });
        const parsedData=bodySchema.safeParse(body);
        // console.log(parsedData);
        if(!parsedData.success){
            return NextResponse.json({ok:false,message:"Invalid input."},{status:400});
        }
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const parsedBody=parsedData.data;
        const {itemId,rating,review}=parsedBody;
        const itemCount=await Items.findById(itemId).countDocuments();
        if(itemCount==0){
            return NextResponse.json({ok:false,message:"Item doesn't exist."},{status:400});
        }
        const prevReviewCount=await Reviews.findOne({user:userId,item:itemId}).countDocuments();
        if(prevReviewCount>0){
            return NextResponse.json({ok:false,message:"You can't submit multiple review for a item."},{status:400});
        }
        db_session=await mongoose.startSession();
        db_session.startTransaction();
        const item= await Items.findById(itemId).select({total_review:1,rating:1}).session(db_session);
        let total_rating=item.total_review*item.rating;
        item.total_review++;
        item.rating=(total_rating+rating)/item.total_review;
        const newReview=new Reviews({user:userId,item:itemId,rating,review});
        await newReview.save();
        await item.save();
        await db_session.commitTransaction();
        db_session=null;
        let addedReview={_id:newReview._id,rating:rating,review:review,user:session.user};
        return NextResponse.json({ok:true,message:"Review submitted successfully.",review:addedReview},{status:200});
    }
    catch(err){
        try{
            if(db_session){
                await db_session.abortTransaction();
            }
        }
        finally{
            return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
        }
    }
}