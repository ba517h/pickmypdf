"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Edit3,
  Plus,
  MapPin,
  ExternalLink
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ItinerariesListResponse } from '@/lib/schemas';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const [itineraries, setItineraries] = useState<ItinerariesListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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
  }, []); // Empty dependency array to prevent infinite loop

  const handleCreateNew = () => {
    router.push('/itinerary');
  };

  const handleEdit = (id: string) => {
    router.push(`/itinerary?draftId=${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      setDeletingId(id);

      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete itinerary');
      }

      toast({
        title: "Itinerary Deleted",
        description: `"${title}" has been deleted successfully.`,
      });

      // Refresh the list after deletion
      await loadItineraries();
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = async (id: string, title: string) => {
    try {
      setExportingId(id);

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
        title: "PDF Downloaded",
        description: `"${title}" has been downloaded as PDF.`,
      });

    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingId(null);
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
      if (diffInDays === 1) {
        return '1 day ago';
      } else if (diffInDays < 30) {
        return `${diffInDays} days ago`;
      } else {
        return formatDate(dateString);
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Travel Itineraries</h1>
          <p className="text-gray-600">Manage and organize your travel plans</p>
        </div>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Itineraries</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadItineraries} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Travel Itineraries</h1>
        <p className="text-gray-600">
          {itineraries.length === 0 
            ? "Start creating amazing travel experiences" 
            : `Manage and organize your ${itineraries.length} travel plan${itineraries.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {/* Create New Button */}
      <div className="mb-6">
        <Button 
          onClick={handleCreateNew}
          className="bg-black hover:bg-gray-800 text-white"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Itinerary
        </Button>
      </div>

      {/* Empty State */}
      {itineraries.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="text-gray-400 mb-6">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No itineraries yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your travel planning journey by creating your first itinerary. 
              Use our AI-powered tools to build amazing travel experiences.
            </p>
            <Button 
              onClick={handleCreateNew}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Itinerary
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Itineraries Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {itinerary.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      Last edited {formatRelativeTime(itinerary.updated_at)}
                    </CardDescription>
                  </div>
                  {itinerary.last_exported_at && (
                    <Badge variant="secondary" className="ml-2">
                      <Download className="h-3 w-3 mr-1" />
                      Exported
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(itinerary.created_at)}
                  {itinerary.last_exported_at && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>PDF exported {formatRelativeTime(itinerary.last_exported_at)}</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(itinerary.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>

                  {itinerary.last_exported_at && (
                    <Button
                      onClick={() => handleDownloadPDF(itinerary.id, itinerary.title)}
                      disabled={exportingId === itinerary.id}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {exportingId === itinerary.id ? (
                        <div className="h-3 w-3 mr-1 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 mr-1" />
                      )}
                      Download PDF
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingId === itinerary.id}
                      >
                        {deletingId === itinerary.id ? (
                          <div className="h-3 w-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Itinerary</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{itinerary.title}&rdquo;? 
                          This action cannot be undone and will permanently remove the itinerary and all its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(itinerary.id, itinerary.title)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 