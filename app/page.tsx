"use client";

import { Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";

function HomeContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome to PickMyPDF
      </h1>
      <p className="text-lg text-muted-foreground">
        Your all-in-one PDF management solution. Upload, process, and manage your PDF documents with ease.
      </p>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Secure Google OAuth authentication</li>
          <li>Role-based access control</li>
          <li>PDF processing and management</li>
          <li>Modern, responsive interface</li>
        </ul>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
