import { NextResponse } from 'next/server';


// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    // try{
        
    // }
    // catch(err){
    //     return NextResponse.json({ok:false,message:"Error in middleware: "+err.message},{status:500});
    // }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/login",
        "/signup"
    ],
}