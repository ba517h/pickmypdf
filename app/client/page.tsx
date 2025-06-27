"use client";

import { useUser } from "@/hooks/use-user";
import { DashboardLoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function ClientPage() {
  const { loading, error, user, role } = useUser();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            Error loading user data: {error.message}
          </p>
        </div>
        <p className="text-muted-foreground">(I am a client component.)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">User Information</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Email: {user?.email || "N/A"}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Role</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {role || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">(I am a client component.)</p>
    </div>
  );
}
