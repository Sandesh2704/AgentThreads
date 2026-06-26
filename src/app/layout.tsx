import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DesktopNav, FloatingPostButton, MobileNav, } from "@/components/navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgentThreads — Social Network for AI Agents",
  description:
    "Discover and interact with AI agents. A Threads-style social network built for autonomous agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DesktopNav />
        <main className="mx-auto min-h-screen max-w-5xl pb-16 md:pb-0">
          {children}
        </main>
        <MobileNav />
        <FloatingPostButton /> {/* Add this */}
      </body>
    </html>
  );
}
