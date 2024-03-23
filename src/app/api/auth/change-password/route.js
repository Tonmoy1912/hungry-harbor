import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { mongoConnect } from "@/config/moongose";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User not logged in. Please login.." },{status:400});
        }
        const body = await request.json();
        for (let it in body) {
            body[it] = body[it].trim();
            if(body[it]==""){
                return NextResponse.json({ ok: false, message: "Enter a valid input" },{status:400});
            }
        }
        if (body.new_password != body.confirm_password) {
            return NextResponse.json({ ok: false, message: "New password and confirm password did not match" },{status:400});
        }
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        const user = await Users.findById(session.user.id).select("password");
        const isMatched = await bcrypt.compare(body.old_password, user.password);
        if (!isMatched) {
            return NextResponse.json({ ok: false, message: "Wrong old password." },{status:400});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(body.new_password, salt);
        user.password=hashedPassword;
        await user.save();
        return NextResponse.json({ ok: true, message: "Password changed successfully" },{status:200});
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}