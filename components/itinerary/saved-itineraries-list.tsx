"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Trash2, 
  Download, 
  Calendar,
  Clock,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItinerariesListResponse } from '@/lib/schemas';
import { useToast } from '@/components/ui/use-toast';

interface SavedItinerariesListProps {
  onLoadItinerary: (id: string) => void;
  onDeleteItinerary: (id: string) => void;
  className?: string;
}

export function SavedItinerariesList({ 
  onLoadItinerary, 
  onDeleteItinerary,
  className = '' 
}: SavedItinerariesListProps) {
  const [itineraries, setItineraries] = useState<ItinerariesListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/itineraries');
      if (!response.ok) {
        throw new Error('Failed to load itineraries');
      }

      const data = await response.json() as ItinerariesListResponse;
      setItineraries(data);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      setError(error instanceof Error ? error.message : 'Failed to load itineraries');
      
      toast({
        title: "Load Failed",
        description: "Failed to load your saved itineraries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItineraries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await onDeleteItinerary(id);
      // Refresh the list after deletion
      await loadItineraries();
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const handleExport = async (id: string, title: string) => {
    try {
      // Load the full itinerary data
      const response = await fetch(`/api/itineraries/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load itinerary');
      }

      const itinerary = await response.json();
      
      // Generate PDF
      const pdfResponse = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary.form_data),
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download PDF
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'itinerary'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mark as exported
      await fetch(`/api/itineraries/${id}/export`, {
        method: 'POST',
      });

      // Refresh the list to update export timestamp
      await loadItineraries();

      toast({
        title: "PDF Exported",
        description: `"${title}" has been downloaded as PDF.`,
      });

    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Saved Itineraries</h3>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadItineraries}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Saved Itineraries</h3>
        <Badge variant="secondary">{itineraries.length}</Badge>
      </div>

      {itineraries.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No saved itineraries yet. Create your first one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {itinerary.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {formatDate(itinerary.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatRelativeTime(itinerary.updated_at)}
                      </span>
                      {itinerary.last_exported_at && (
                        <Badge variant="outline" className="text-xs">
                          Exported {formatDate(itinerary.last_exported_at)}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onLoadItinerary(itinerary.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Load & Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(itinerary.id, itinerary.title)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(itinerary.id, itinerary.title)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 