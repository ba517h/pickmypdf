import { useState, useCallback, useEffect, useRef } from 'react';
import { ItineraryFormData, SaveStatus } from '@/lib/types';
import { ItineraryResponse, ItinerariesListResponse } from '@/lib/schemas';
import { useToast } from '@/components/ui/use-toast';

interface UseItineraryPersistenceProps {
  formData: ItineraryFormData;
  currentItineraryId?: string | null;
  autoSaveDelay?: number; // ms delay for debounced auto-save
}

export function useItineraryPersistence({
  formData,
  currentItineraryId,
  autoSaveDelay = 60000
}: UseItineraryPersistenceProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Use refs to avoid stale closures in debounced functions
  const formDataRef = useRef(formData);
  const currentItineraryIdRef = useRef(currentItineraryId);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Update refs when props change
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    currentItineraryIdRef.current = currentItineraryId;
  }, [currentItineraryId]);

  // Create new itinerary
  const createItinerary = useCallback(async (title: string): Promise<ItineraryResponse | null> => {
    try {
      setSaveStatus('saving');
      
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          form_data: formDataRef.current,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create itinerary');
      }

      const itinerary = await response.json() as ItineraryResponse;
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      
      toast({
        title: "Itinerary Created",
        description: `"${title}" has been saved successfully.`,
      });

      return itinerary;
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setSaveStatus('error');
      
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to create itinerary",
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  // Update existing itinerary
  const updateItinerary = useCallback(async (
    id: string, 
    updates: { title?: string; form_data?: ItineraryFormData }
  ): Promise<ItineraryResponse | null> => {
    try {
      setSaveStatus('saving');
      
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update itinerary');
      }

      const itinerary = await response.json() as ItineraryResponse;
      setSaveStatus('saved');
      setLastSavedAt(new Date());

      return itinerary;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      setSaveStatus('error');
      
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to update itinerary",
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  // Load specific itinerary
  const loadItinerary = useCallback(async (id: string): Promise<ItineraryResponse | null> => {
    try {
      const response = await fetch(`/api/itineraries/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load itinerary');
      }

      const itinerary = await response.json() as ItineraryResponse;
      return itinerary;
    } catch (error) {
      console.error('Error loading itinerary:', error);
      
      toast({
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Failed to load itinerary",
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  // List all user itineraries
  const listItineraries = useCallback(async (): Promise<ItinerariesListResponse | null> => {
    try {
      const response = await fetch('/api/itineraries');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load itineraries');
      }

      const itineraries = await response.json() as ItinerariesListResponse;
      return itineraries;
    } catch (error) {
      console.error('Error listing itineraries:', error);
      
      toast({
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Failed to load itineraries",
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  // Delete itinerary
  const deleteItinerary = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete itinerary');
      }

      toast({
        title: "Itinerary Deleted",
        description: "The itinerary has been deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete itinerary",
        variant: "destructive",
      });

      return false;
    }
  }, [toast]);

  // Mark itinerary as exported
  const markAsExported = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/itineraries/${id}/export`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update export timestamp');
      }

      return true;
    } catch (error) {
      console.error('Error marking as exported:', error);
      return false;
    }
  }, []);

  // Manual save function
  const saveManually = useCallback(async (title?: string): Promise<ItineraryResponse | null> => {
    const currentId = currentItineraryIdRef.current;
    const currentFormData = formDataRef.current;
    
    if (currentId) {
      // Update existing itinerary
      const updates: { title?: string; form_data: ItineraryFormData } = {
        form_data: currentFormData,
      };
      
      if (title) {
        updates.title = title;
      }
      
      return await updateItinerary(currentId, updates);
    } else {
      // Create new itinerary
      const itineraryTitle = title || currentFormData.title || 'Untitled Itinerary';
      return await createItinerary(itineraryTitle);
    }
  }, [createItinerary, updateItinerary]);

  // Auto-save with debouncing
  const triggerAutoSave = useCallback(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if we have an existing itinerary ID
    if (!currentItineraryIdRef.current) {
      return;
    }

    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(async () => {
      const currentId = currentItineraryIdRef.current;
      const currentFormData = formDataRef.current;
      
      if (currentId && currentFormData) {
        await updateItinerary(currentId, { form_data: currentFormData });
      }
    }, autoSaveDelay);
  }, [updateItinerary, autoSaveDelay]);

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (currentItineraryId && saveStatus !== 'saving') {
      triggerAutoSave();
    }

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, currentItineraryId, saveStatus, triggerAutoSave]);

  return {
    saveStatus,
    lastSavedAt,
    createItinerary,
    updateItinerary,
    loadItinerary,
    listItineraries,
    deleteItinerary,
    markAsExported,
    saveManually,
  };
} 