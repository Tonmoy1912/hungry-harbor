import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import bcrypt from "bcrypt";
import { mongoConnect } from "@/config/moongose";

export async function POST(request) {
    try {
        const body = await request.json();
        let { new_password, confirm_password } = body;
        new_password = new_password.trim();
        confirm_password = confirm_password.trim();
        if (new_password == "") {
            return NextResponse.json({ ok: false, message: "Generate OTP first" }, { status: 400 });
        }
        if (new_password != confirm_password) {
            return NextResponse.json({ ok: false, message: "New and confirm password didn't matched." }, { status: 400 });
        }
        const cookieStore = cookies();
        let token = cookieStore.get("otp-token");
        if (!token) {
            return NextResponse.json({ ok: false, message: "Generate OTP first" }, { status: 400 });
        }
        token = token.value;
        let tokenObj = jwt.verify(token, process.env.FORGOT_PASSWORD_KEY);
        // console.log("tokenObj",tokenObj);
        let {email} = tokenObj;
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const user = await Users.findOne({ email: email }).select({ email: 1, password: 1 });
        if (!user) {
            return NextResponse.json({ ok: false, message: "No user with the given email" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        user.password=hashedPassword;
        await user.save();
        cookieStore.delete("otp-token");
        return NextResponse.json({ ok: true, message: "Password changed successfully" }, { status: 200 });
    }
    catch (err) {
        if (err.message == "jwt expired") {
            return NextResponse.json({ ok: false, message: "Timeout" }, { status: 400 });
        }
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}