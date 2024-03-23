import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import mongoose from "mongoose";
import Users from "@/models/user/userSchema";
import { mongoConnect } from "@/config/moongose";


export async function POST(request) {
    try {
        const session =await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ ok: false, message: "User is not Logged in." }, { status: 400 });
        }
        const body = await request.json();//body={name,value};
        // console.log("session",session);
        body.value=body.value.trim();
        if (!body.value || body.value == "") {
            return NextResponse.json({ ok: false, message: "Enter valid input" }, { status: 400 });
        }
        if (body.name == "email") {
            return NextResponse.json({ ok: false, message: "Email can't be changed" }, { status: 400 });
        }
        // await mongoose.connect(process.env.MONGO_URL);
        await mongoConnect();
        if (body.name == "name" || body.name == "phone" || body.name == "address") {
            const user=await Users.findByIdAndUpdate(session.user.id, { [body.name] : body.value });
            // console.log("user",user);
            // console.log({ [body.name] : body.value });
            return NextResponse.json({ ok: true, message: `${body.name.charAt(0).toUpperCase() + body.name.slice(1)} updated Successfully` }, { status: 200 });
        }
        return NextResponse.json({ ok: false, message: `${body.name.charAt(0).toUpperCase() + body.name.slice(1)} can't be updated` }, { status: 400 });

    }
    catch (err) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}