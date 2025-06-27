"use client";

import { Suspense } from "react";
import Link from "next/link";
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

function HomeContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome to PickMyPDF
      </h1>
      <p className="text-lg text-muted-foreground">
        Your all-in-one PDF management solution. Upload, process, and manage your PDF documents with ease.
      </p>
      <div className="flex gap-4 mb-6">
        <Link href="/itinerary">
          <Button size="lg" className="gap-2">
            <FileText className="w-5 h-5" />
            Create Travel Itinerary
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Secure Google OAuth authentication</li>
          <li>Role-based access control</li>
          <li>Multi-step itinerary creator with PDF export</li>
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
