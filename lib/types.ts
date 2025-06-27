// Shared types for the application

export interface ItineraryFormData {
  // Step 1: Overview
  title: string;
  destination: string;
  duration: string;
  routing: string;
  tags: string[];
  tripType: string;
  
  // Main itinerary image
  mainImage?: string;
  
  // City-level images
  cityImages?: Array<{
    city: string;
    image?: string;
  }>;

  // Step 2: Highlights
  hotels: Array<{
    name: string;
    image?: string;
  }>;
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
  

}

// API Request/Response types
export interface ExtractApiResponse {
  data: ItineraryFormData;
}

export interface ExtractApiError {
  error: string;
} 