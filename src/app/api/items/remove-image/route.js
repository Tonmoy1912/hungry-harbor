import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { deleteBlob } from "@/util/azure_blob_utils";


export async function POST(req) {
    try {
        const body = await req.json();
        const { url } = body;
        if (!url || typeof url !== "string") {
            return NextResponse.json({ ok: false, message: "Url is required", type: "Failed" }, { status: 400 });
        }
        await deleteBlob(url);

        return NextResponse.json({
            ok: true,
            message: "Image removed successfully."
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { ok: false, message: error.message, type: "Failed" },
            { status: 500 }
        );
    }
}