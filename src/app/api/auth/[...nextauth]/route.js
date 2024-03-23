//completely done

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod"
import Users from "@/models/user/userSchema";
import Owners from "@/models/owner/ownerSchema";
import { mongoConnect } from "@/config/moongose";

function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
    }
    randomString += (new Date().toUTCString());

    return randomString;
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            async authorize(credentials, req) {
                let { email, password } = credentials;
                email=email.trim();
                password.trim();
                const Body = z.object({
                    email: z.string().email(),
                    password: z.string().min(1)
                });
                const { success, data } = Body.safeParse({ email, password });
                if (!success) {
                    // return NextResponse.json({ ok: false, message: "Enter valid input" }, { status: 400 });
                    return null;
                }
                // await mongoose.connect(process.env.MONGO_URL);
                await mongoConnect();
                const prevUser = await Users.findOne({ email }).select({ email: 1, password: 1, name: 1 });
                if (!prevUser) {
                    // return NextResponse.json({ ok: false, message: "User doesn't exist" }, { status: 400 });
                    return null;
                }
                const isMatched = await bcrypt.compare(password, prevUser.password);
                if (!isMatched) {
                    // return NextResponse.json({ ok: false, message: "Enter valid input" }, { status: 400 });
                    return null;
                }
                return {
                    email: prevUser.email,
                    id: prevUser.id
                    // name: prevUser.name
                };//this will be found in session as user
            }
        }),
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // await mongoose.connect(process.env.MONGO_URL);
            await mongoConnect();
            // console.log("user in jwt",user);
            if (account && account.provider == "google") {//signing in
                // await mongoose.connect(process.env.MONGO_URL);
                // console.log("User signed in with google");
                // console.log("user", user);
                const prevUser = await Users.findOne({ email: user.email }).select({ email: 1, password: 1, name: 1 });
                if (!prevUser) {
                    let password = generateRandomString(10);
                    const salt = await bcrypt.genSalt(10);
                    password = await bcrypt.hash(password, salt);
                    const newUser = new Users({ email: user.email, name: user.name, password });
                    await newUser.save();
                    token.id = newUser.id;
                    token.email = newUser.email;
                }
                else{
                    token.id = prevUser.id;
                    token.email = prevUser.email;
                }
            }
            if(account && account.provider == "credentials"){
                token.email=user.email;
                token.id=user.id;
            }
            // console.log("session form jwt",session);
            const owner=await Owners.findOne({email:token.email});
            if(owner){
                token.isAdmin=true;
            }
            else{
                token.isAdmin=false;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            // console.log("token",token);
            // console.log("user",user);
            session.user.email = token.email;
            session.user.id = token.id;
            session.user.isAdmin=token.isAdmin;
            return session;
        }
    }
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };