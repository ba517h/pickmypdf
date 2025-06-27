"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { AuthLoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });

      if (error) {
        throw error;
      }
      
      // Show loading state while redirecting
      setIsPageLoading(true);
    } catch (error) {
      toast({
        title: "Please try again.",
        description: "There was an error logging in with Google.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  }

  if (isPageLoading) {
    return <AuthLoadingSkeleton />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to PickMyPDF
          </h1>
          <p className="text-muted-foreground">
            Access your PDF management dashboard
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
          className="w-full"
        >
          {isGoogleLoading ? (
            <Icons.loaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-6" />
          )}
          {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}
