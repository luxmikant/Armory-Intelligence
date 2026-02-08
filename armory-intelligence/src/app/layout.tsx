import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arsenal Nexus — Star Wars × Modern Military AI Platform",
  description:
    "Where the Galaxy Far, Far Away meets modern military engineering. Compare Star Wars blasters to real-world firearms, explore tactical briefings, and experience AI-powered weapon analysis through Tambo Generative UI.",
  keywords: ["Star Wars", "weapons", "blasters", "firearms", "AI", "Tambo", "generative UI", "comparison", "Arsenal Nexus"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
