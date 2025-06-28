import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";

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
      <body className="font-manrope">
        <MainNav />
        <main className="flex-1 p-10">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
