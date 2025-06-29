import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getUserRole } from "@/lib/get-user-role";
import { createClient } from "@/lib/supabase/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Allow public access to /, /auth/signin, /auth/callback, /api/*, and static files
  const publicPaths = ["/", "/auth/signin", "/auth/callback"];
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  const isStatic = request.nextUrl.pathname.startsWith("/_next") || request.nextUrl.pathname.startsWith("/static") || request.nextUrl.pathname.startsWith("/favicon.ico");
  
  if (publicPaths.includes(request.nextUrl.pathname) || isApi || isStatic) {
    return supabaseResponse;
  }

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the user's role using the custom getUserRole function
  const role = await getUserRole();

  // Redirect non-admin users trying to access admin pages to the home page
  if (
    user &&
    role !== "admin" &&
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users trying to access protected routes to sign-in page with redirectTo
  const protectedRoutes = ["/itinerary", "/admin", "/protected", "/server", "/client", "/dashboard"];
  if (!user && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = "/auth/signin";
    url.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to sign-in page (for other protected routes)
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users attempting to access the sign-in page to the app
  if (user && request.nextUrl.pathname === "/auth/signin") {
    const url = request.nextUrl.clone();
    url.pathname = "/itinerary";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
