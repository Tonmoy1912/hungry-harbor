import { NextResponse } from 'next/server'


// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    //   return NextResponse.redirect(new URL('/home', request.url))
    // console.log("Process.env", process.env.HOST);
    // console.log(`${request.nextUrl.pathname} get called`);
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/login",
        "/signup"
    ],
}