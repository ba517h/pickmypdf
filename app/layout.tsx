import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Supabase Auth + Next.js Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Don't show MainNav on landing page - it has its own custom navigation
  const showMainNav = pathname !== "/";

  return (
    <html lang="en">
      <body className="font-manrope">
        {showMainNav && <MainNav />}
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
