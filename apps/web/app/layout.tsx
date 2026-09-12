import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import CelebrioChatWidget from "@/components/chat/CelebrioChatWidget";

export const metadata: Metadata = {
  title: "Celebrio | Celebrate Every Moment - Luxury Wedding & Event Planning",
  description: "End-to-end bespoke wedding and luxury event planning, design, and management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CelebrioChatWidget />
      </body>
    </html>
  );
}
