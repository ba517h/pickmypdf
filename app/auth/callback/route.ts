import { NextResponse } from "next/server"
 
import { createClient } from "@/lib/supabase/server"
 
export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url)
 
  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
 
  if (code) {
    // Create a Supabase client
    const supabase = createClient()
 
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
 
    if (!error) {
      // Verify the session is properly established before redirecting
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (session && !sessionError) {
        // Create the redirect response with proper headers
        const redirectResponse = NextResponse.redirect(`${origin}${next}`)
        
        // Force a refresh of cookies to ensure session is properly set
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          console.log(`Successful auth callback for user: ${user.email}, redirecting to: ${next}`)
          return redirectResponse
        }
      }
      
      console.warn('Session not properly established after code exchange')
    } else {
      console.error('Error exchanging code for session:', error)
    }
  }
 
  // If there's no code or an error occurred, redirect to an error page
  console.error('Auth callback failed - no code or session error')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}