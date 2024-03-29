import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Categories from "@/models/category/categorySchema";
import Items from "@/models/item/itemSchema";
import { z } from "zod";
import { initializeApp } from "firebase/app";
import { getStorage,ref, deleteObject } from "firebase/storage";
import { mongoConnect } from "@/config/moongose";

export async function POST(request) {
    let db_session = null;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ ok: false, message: "Unauthorized..!", type: "Failed" }, { status: 400 });
        }
        let body = await request.json();
        const BodySchema = z.object({
            id: z.string().trim().min(1),
            name: z.string().trim().min(1),
            image: z.string().url(),
            description: z.string().trim(),
            price: z.coerce.number().int().nonnegative(),
            category: z.string().trim().min(1).toUpperCase(),
            in_stock: z.coerce.number().int().nonnegative(),
            global_order: z.coerce.number().int().nonnegative(),
            category_order: z.coerce.number().int().nonnegative()
        });
        const parsedBody = BodySchema.safeParse(body);
        // return NextResponse.json(parsedBody);
        if (!parsedBody.success) {
            return NextResponse.json({ ok: false, message: "Enter valid input", type: "Failed" }, { status: 400 });
        }
        let { id, name, image, description, price, category, in_stock, global_order, category_order } = parsedBody.data;
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();


        //put inside db transaction............................
        db_session = await mongoose.startSession();
        db_session.startTransaction();
        let db_category = await Categories.findOne({ category }).session(db_session);
        if (!db_category) {
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "No such category..", type: "Failed" }, { status: 400 });
        }
        let db_item = await Items.findOne({ name, removed: false }).select({ name: 1 }).session(db_session);
        if (db_item && db_item.id != id) {
            await db_session.abortTransaction();
            return NextResponse.json({ ok: false, message: "Another item have the same name", type: "Failed" }, { status: 400 });
        }
        let prev_item_state = await Items.findById(id).select({ category: 1, image: 1 }).session(db_session);
        let prev_category_name = prev_item_state.category;
        let prev_image = prev_item_state.image;
        let prev_category = await Categories.findOne({ category: prev_category_name }).session(db_session);
        let updationInfo = await Items.findByIdAndUpdate(id, { name, image, description, price, category, in_stock, global_order, category_order }).session(db_session);
        if (category != prev_category_name) {
            db_category.total++;
            prev_category.total--;
            await db_category.save();
            await prev_category.save();
        }
        await db_session.commitTransaction();
        db_session=null;
        //put inside db transaction............................
        if (prev_image != image && prev_image != process.env.NOT_FOUND_IMAGE) {
            
                const firebaseConfig = {
                    apiKey: process.env.FIREBASE_APIKEY,
                    authDomain: process.env.FIREBASE_AUTHDOMAIN,
                    projectId: process.env.FIREBASE_PROJECTID,
                    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
                    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
                    appId: process.env.FIREBASE_APPID,
                    measurementId: process.env.FIREBASE_MEASUREMENTID
                };
                // Initialize Firebase
                const app = initializeApp(firebaseConfig);
                const storage = getStorage(app);
                let imageRef=ref(storage,prev_image);
                await deleteObject(imageRef);
        }

        return NextResponse.json({ ok: true, message: "Item Updated successfully", item: updationInfo, type: "Success" }, { status: 200 });
    }
    catch (err) {
        try{
            if(db_session){
                db_session.abortTransaction();
            }
        }
        finally{
            return NextResponse.json({ok:false,message:err.message,type:"Failed"},{status:400});
        }
    }
}