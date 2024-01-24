import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import SessionProvider from "@/components/session/SessionProvider"
import { getServerSession } from "next-auth";
import RecoilRoot from "@/components/recoilState/RecoilState"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <SessionProvider session={session}>
          <RecoilRoot>
            <Navbar>
              {children}
            </Navbar>
          </RecoilRoot>
        </SessionProvider>
      </body>
    </html>
  );
}
