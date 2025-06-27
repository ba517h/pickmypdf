"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function AuthForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    
    // Get redirectTo from URL params or default to /itinerary
    const redirectTo = searchParams.get('redirectTo') || '/itinerary';
    
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });
    setGoogleLoading(false);
    if (error) {
      toast({ title: "Google Sign In Error", description: error.message, variant: "destructive" });
    } else {
      // Supabase will redirect, but as fallback:
      router.push(redirectTo);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Sign in to PickMyPDF
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Access your PDF management dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Icons.loaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Icons.google className="w-5 h-5 mr-2" />
            )}
            Continue with Google
          </Button>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our terms of service
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 