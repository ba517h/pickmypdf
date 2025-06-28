import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supabase Auth + Next.js Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <MainNav />
        <main className="flex-1 p-10">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
