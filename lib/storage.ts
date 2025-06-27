"use client";

import { ItineraryFormData } from "@/lib/types";

const STORAGE_KEY = "itinerary-draft";
const STORAGE_TIMESTAMP_KEY = "itinerary-draft-timestamp";

/**
 * Storage utility for managing itinerary drafts in localStorage
 */

/**
 * Save an itinerary draft to localStorage with timestamp
 */
export function saveDraft(data: ItineraryFormData): void {
  try {
    const serializedData = JSON.stringify(data);
    const timestamp = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, serializedData);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, timestamp);
    
    console.log("[Draft] Saved successfully at", timestamp);
  } catch (error) {
    console.error("[Draft] Failed to save:", error);
  }
}

/**
 * Load an itinerary draft from localStorage
 * Returns null if no draft exists or if parsing fails
 */
export function loadDraft(): { data: ItineraryFormData; timestamp: string } | null {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    
    if (!serializedData || !timestamp) {
      return null;
    }
    
    const data: ItineraryFormData = JSON.parse(serializedData);
    
    // Basic validation to ensure the data structure is valid
    if (!data || typeof data !== 'object' || !data.title) {
      console.warn("[Draft] Invalid draft data structure, ignoring");
      return null;
    }
    
    console.log("[Draft] Loaded successfully from", timestamp);
    return { data, timestamp };
  } catch (error) {
    console.error("[Draft] Failed to load:", error);
    return null;
  }
}

/**
 * Check if a draft exists in localStorage
 */
export function hasDraft(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    return !!(data && timestamp);
  } catch (error) {
    console.error("[Draft] Failed to check for draft:", error);
    return false;
  }
}

/**
 * Clear the saved draft from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    console.log("[Draft] Cleared successfully");
  } catch (error) {
    console.error("[Draft] Failed to clear:", error);
  }
}

/**
 * Get the timestamp of the last saved draft
 */
export function getDraftTimestamp(): string | null {
  try {
    return localStorage.getItem(STORAGE_TIMESTAMP_KEY);
  } catch (error) {
    console.error("[Draft] Failed to get timestamp:", error);
    return null;
  }
}

/**
 * Format draft timestamp for display
 */
export function formatDraftTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error("[Draft] Failed to format timestamp:", error);
    return "unknown time";
  }
} 