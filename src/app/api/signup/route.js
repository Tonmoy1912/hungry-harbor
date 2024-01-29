//completely done

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {z} from "zod"
import Users from "@/models/user/userSchema";

export async function POST(request){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        const body=await request.json();
        // console.log("body",body);
        const Body=z.object({
            email: z.string().email(),
            password: z.string().min(1),
            confirm_password: z.string().min(1),
            name: z.string().min(1)
        });
        // console.log(Body.safeParse(body));
        const {success,data}=Body.safeParse(body);
        if(!success){
            return NextResponse.json({ok:false,message:"Enter valid input"},{status:400});
        }
        const {email,password,confirm_password,name}=body;
        if(password!=confirm_password){
            return NextResponse.json({ok:false,message:"Password doesn't match"},{status:400});
        }
        //.................checking for duplicate email..............
        const prevUser=await Users.findOne({email}).select({email:1,password:1,name:1});
        if(prevUser){
            return NextResponse.json({ok:false,message:"The email already exists"},{status:400});
        }
        //.....................password hashing part...............
        const salt=await bcrypt.genSalt(10);
        const securePassword=await bcrypt.hash(password,salt);
        const newUser=new Users({name,email,password:securePassword});
        await newUser.save();
        // console.log(newUser);
        // console.log("secure password",securePassword);
        // console.log("compare",await bcrypt.compare(password,securePassword));
        return NextResponse.json({ok:true,message:"New User Created Successfully"},{status:200});
    }
    catch(err){
        return NextResponse.json({ok:false,message:err.message},{status:500});
    }
}