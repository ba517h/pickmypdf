// Shared types for the application
import { Database } from "@/database.types";

// Database types for itineraries
export type ItineraryRow = Database['public']['Tables']['itineraries']['Row'];
export type ItineraryInsert = Database['public']['Tables']['itineraries']['Insert'];
export type ItineraryUpdate = Database['public']['Tables']['itineraries']['Update'];

// Save status for UI indicators
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface Hotel {
  name: string;
  city?: string;
  nights?: number;
  image?: string;
  rating?: number;
  phrases?: string[];
  fetchedFromAPI?: boolean;
}

export interface ItineraryFormData {
  // Step 1: Overview
  title: string;
  destination: string;
  duration: string;
  routing: string;
  summary?: string;
  tags: string[];
  tripType: string;
  costInINR?: string;
  
  // Main itinerary image
  mainImage?: string;
  
  // City-level images
  cityImages?: Array<{
    city: string;
    image?: string;
  }>;

  // Step 2: Highlights
  hotels: Hotel[];
  experiences: Array<{
    name: string;
    image?: string;
  }>;
  practicalInfo: {
    visa: string;
    currency: string;
    tips: string[];
    // Additional inclusions with images
    otherInclusions?: Array<{
      name: string;
      description?: string;
      image?: string;
    }>;
  };

  // Step 3: Day-wise Itinerary
  dayWiseItinerary: Array<{
    day: number;
    title: string;
    content: string;
    image?: string;
  }>;

  // Step 4: Optional Blocks
  withKids: string;
  withFamily: string;
  offbeatSuggestions: string;

  // Destination Gallery
  destinationGallery?: Array<{
    name: string;
    image?: string;
    type: "city" | "activity" | "landmark";
  }>;
}

// API Request/Response types
export interface ExtractApiResponse {
  data: ItineraryFormData;
}

export interface ExtractApiError {
  error: string;
} 