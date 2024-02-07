import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ ok: false, firebaseConfig: null, type: "Failed" }, { status: 400 });
        }
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_APIKEY,
            authDomain: process.env.FIREBASE_AUTHDOMAIN,
            projectId: process.env.FIREBASE_PROJECTID,
            storageBucket: process.env.FIREBASE_STORAGEBUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
            appId: process.env.FIREBASE_APPID,
            measurementId: process.env.FIREBASE_MEASUREMENTID
        };
        return NextResponse.json({ ok: true, firebaseConfig: firebaseConfig, type: "Failed" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, firebaseConfig: null, type: "Failed" }, { status: 400 });
    }
}