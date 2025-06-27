// Shared types for the application

export interface ItineraryFormData {
  // Step 1: Overview
  title: string;
  destination: string;
  duration: string;
  routing: string;
  tags: string[];
  tripType: string;

  // Step 2: Highlights
  hotels: string[];
  experiences: string[];
  practicalInfo: {
    visa: string;
    currency: string;
    tips: string[];
  };

  // Step 3: Day-wise Itinerary
  dayWiseItinerary: Array<{
    day: number;
    title: string;
    content: string;
  }>;

  // Step 4: Optional Blocks
  withKids: string;
  withFamily: string;
  offbeatSuggestions: string;
}

// API Request/Response types
export interface ExtractApiResponse {
  data: ItineraryFormData;
}

export interface ExtractApiError {
  error: string;
} 