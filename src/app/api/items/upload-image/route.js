import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { uploadImage } from "@/util/azure_blob_utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = new Set([
    "jpeg",
    "jpg",
    "png"
]);

export async function POST(req) {
    try {
        // return NextResponse.json({ ok: true, message: "Hello world" }, { status: 200 });
        const formData = await req.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "File is required." },
                { status: 400 }
            );
        }
        const extension =
            file.name.split(".").pop();

        // Validate MIME type
        if (!ALLOWED_TYPES.has(extension)) {
            return NextResponse.json(
                { error: "Only .jpg, .jpeg and .png are allowed." },
                { status: 400 }
            );
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Maximum allowed size is 5 MB." },
                { status: 400 }
            );
        }

        const blobInfo = await uploadImage(file);

        return NextResponse.json({
            ok: true,
            url: blobInfo.imageUrl
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { ok: false, message: error.message, type: "Failed" },
            { status: 500 }
        );
    }
}