import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "조장 매니저",
  description: "조장 업무 자동화 및 가이드 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-slate-50 text-slate-800 antialiased`}>
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
