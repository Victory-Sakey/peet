import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PEET - AI-Powered Job Marketplace",
  description: "Connect job seekers with employers through smart matching, CV analytics, and AI career guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100 selection:bg-purple-600/30">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}



