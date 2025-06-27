import "server-only";

import { JWTPayload, jwtVerify } from "jose";

import { createClient } from "@/lib/supabase/server";

// Extend the JWTPayload type to include Supabase-specific metadata
type SupabaseJwtPayload = JWTPayload & {
  app_metadata: {
    role: string;
  };
};

export async function getUserRole() {
  // Create a Supabase client for server-side operations
  const supabase = createClient();

  // Retrieve the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let role;

  if (session) {
    // Extract the access token from the session
    const token = session.access_token;

    try {
      // Check if JWT secret is available
      const jwtSecret = process.env.SUPABASE_JWT_SECRET;
      
      if (!jwtSecret) {
        console.warn("SUPABASE_JWT_SECRET not found in environment variables. Using fallback role extraction.");
        // Fallback: Extract role from user metadata if available
        const { data: { user } } = await supabase.auth.getUser();
        role = user?.app_metadata?.role || user?.user_metadata?.role || "user";
        return role;
      }

      // Encode the JWT secret for verification
      const secret = new TextEncoder().encode(jwtSecret);

      // Verify the JWT token and extract the payload
      const { payload } = await jwtVerify<SupabaseJwtPayload>(token, secret);

      // Extract the role from the app_metadata in the payload
      role = payload.app_metadata?.role || "user";
    } catch (error) {
      console.error("Failed to verify token:", error);
      
      // Fallback: Try to get role from user metadata
      try {
        const { data: { user } } = await supabase.auth.getUser();
        role = user?.app_metadata?.role || user?.user_metadata?.role || "user";
      } catch (userError) {
        console.error("Failed to get user data:", userError);
        role = "user"; // Default fallback
      }
    }
  }

  return role;
}
