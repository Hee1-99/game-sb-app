import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Game Scoreboard",
  description: "Real-time Game Scoreboard Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${outfit.className} min-h-full flex flex-col bg-[#0b0e14] text-[#fafafa]`}>
        {children}
      </body>
    </html>
  );
}
