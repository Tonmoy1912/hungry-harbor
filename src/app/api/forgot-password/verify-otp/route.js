import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const body = await request.json();
        body.otp = body.otp.trim();
        body.otp=parseInt(body.otp);
        const cookieStore = cookies();
        let token=cookieStore.get("otp-token");
        if(!token){
            return NextResponse.json({ok:false,message:"Generate OTP first"},{status:400});
        }
        // console.log("token",token);
        token=token.value;
        let tokenObj=jwt.verify(token,process.env.FORGOT_PASSWORD_KEY);
        if(tokenObj.generated_otp!=body.otp){
            return NextResponse.json({ok:false,message:"Invalid otp"},{status:400});
        }
        const {email,generated_otp}=tokenObj
        tokenObj={email,generated_otp,received_otp:body.otp};
        // console.log(tokenObj);
        token=jwt.sign(tokenObj,process.env.FORGOT_PASSWORD_KEY, { expiresIn: 5 * 60 });//in second
        cookieStore.set("otp-token", token);
        return NextResponse.json({ ok: true, message: "OTP verified" }, { status: 200 });
    }
    catch (err) {
        if(err.message=="jwt expired"){
            return NextResponse.json({ok:false,message:"Timeout"},{status:400});
        }
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}