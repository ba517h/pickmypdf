"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <Icons.alertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            We encountered an issue while signing you in. Please try again.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">
              Error: {error}
            </p>
            {errorDescription && (
              <p className="mt-1 text-xs text-destructive/80">
                {errorDescription}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              <Icons.logIn className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Icons.home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            If you continue to experience issues, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
} 