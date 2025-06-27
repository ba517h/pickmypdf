import { NextResponse } from "next/server";

/**
 * Redirect route to handle incorrect /auth/signin requests
 * This fixes 404 errors by redirecting to the correct /signin path
 */
export async function GET() {
  return NextResponse.redirect(new URL("/signin", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
} 