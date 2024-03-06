import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import transporter from "@/config/nodemailer-config";
import bcrypt from "bcrypt";

// Function to generate a random 6-digit number
function generateRandomNumber() {
    const num=Math.floor(100000 + Math.random() * 900000);
    return String(num);
}

export async function POST(request) {
    try {
        const body = await request.json();
        body.email = body.email.trim();
        if(body.email==""){
            return NextResponse.json({ok:false,message:"Enter valid input"},{status:400});
        }
        await mongoose.connect(process.env.MONGO_URL);
        const user = await Users.findOne({ email: body.email }).select({ email: 1 });
        if (!user) {
            return NextResponse.json({ ok: false, message: "No user with the given email" }, { status: 400 });
        }
        const cookieStore = cookies();
        const otp = generateRandomNumber();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const tokenObj = { email: body.email, generated_otp: hashedOTP };
        // console.log(tokenObj);
        const token = jwt.sign(tokenObj, process.env.FORGOT_PASSWORD_KEY, { expiresIn: 5 * 60 });//in second
        //setting the token inside cookie
        cookieStore.set("otp-token", token);
        const info = await transporter.sendMail({
            from: 'Hungry Harbor', // sender address
            to: body.email, // list of receivers
            subject: "OTP for forgot and change password", // Subject line
            // text: "Hello world?", // plain text body
            html: `<b>${otp}</b>`, // html body
        });
        return NextResponse.json({ ok: true, message: "OTP is sent to the given email. Please submit the OTP and change password within 5 minutes." }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}