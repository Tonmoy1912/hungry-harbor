import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/session/SessionProvider"
import { getServerSession } from "next-auth";
import RecoilState from "@/components/recoilState/RecoilState";
import { authOptions } from "./api/auth/[...nextauth]/route";
import QueryProvider from "@/components/react-query-provider/QueryProvider";
import Notification from '@/components/notification/Notification';
import ProgressBar from "@/components/progress-bar/ProgressBar";
import ToastProvider from "@/components/toastProvider/ToastProvider";
import SocketComponent from "@/components/socket/Socket";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hungry Harbor",
  description: "Hungry harbor is a online food ordering app where you can order your favourite foods, track your orders and reviews the items.",
};


export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  // console.log("session",session);
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <SessionProvider session={session}>
          <RecoilState>
            <QueryProvider>
              {children}
              <Notification />
              <ProgressBar />
              <SocketComponent />
            </QueryProvider>
          </RecoilState>
        </SessionProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
