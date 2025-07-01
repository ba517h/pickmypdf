import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Hotel } from "@/lib/types";

// Request schemas
const SearchHotelSchema = z.object({
  hotelName: z.string().min(1),
  destination: z.string().optional(),
});

const FetchHotelsSchema = z.object({
  destination: z.string().min(1),
  limit: z.number().min(1).max(10).default(5),
});

type SearchHotelRequest = z.infer<typeof SearchHotelSchema>;
type FetchHotelsRequest = z.infer<typeof FetchHotelsSchema>;

interface TripAdvisorSearchResult {
  location_id: string;
  name: string;
  location_string?: string;
  photo?: {
    images?: {
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
    };
  };
}

interface TripAdvisorLocationDetails {
  name: string;
  rating?: string;
  num_reviews?: string;
  location_string?: string;
  photo?: {
    images?: {
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
    };
  };
  reviews?: Array<{
    text: string;
    rating: number;
    title?: string;
    user?: {
      username?: string;
      display_name?: string;
    };
    published_date?: string;
  }>;
}

async function searchTripAdvisorLocation(query: string): Promise<TripAdvisorSearchResult[]> {
  const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
  
  if (!TRIPADVISOR_API_KEY) {
    throw new Error("TripAdvisor API key not configured");
  }

  console.log('Searching TripAdvisor for:', query);
  const searchUrl = `https://api.content.tripadvisor.com/api/v1/location/search?key=${TRIPADVISOR_API_KEY}&searchQuery=${encodeURIComponent(query)}&category=hotels&language=en`;

  const response = await fetch(searchUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`TripAdvisor search failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('TripAdvisor search results:', data);
  return data.data || [];
}

async function getTripAdvisorLocationDetails(locationId: string): Promise<TripAdvisorLocationDetails | null> {
  const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
  
  if (!TRIPADVISOR_API_KEY) {
    throw new Error("TripAdvisor API key not configured");
  }

  console.log('Fetching details for location:', locationId);
  const detailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${TRIPADVISOR_API_KEY}&language=en&currency=USD`;

  const response = await fetch(detailsUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`TripAdvisor details failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('TripAdvisor location details:', data);
  return data || null;
}

async function getTripAdvisorLocationPhotos(locationId: string): Promise<any[]> {
  const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
  
  if (!TRIPADVISOR_API_KEY) {
    throw new Error("TripAdvisor API key not configured");
  }

  const photosUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${TRIPADVISOR_API_KEY}&language=en`;

  const response = await fetch(photosUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

async function getTripAdvisorLocationReviews(locationId: string): Promise<any[]> {
  const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
  
  if (!TRIPADVISOR_API_KEY) {
    throw new Error("TripAdvisor API key not configured");
  }

  const reviewsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?key=${TRIPADVISOR_API_KEY}&language=en`;

  const response = await fetch(reviewsUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

// Generate smart phrases based on rating and location
function generateSmartPhrases(rating: number, hotelName: string, destination?: string): string[] {
  const phrases: string[] = [];
  console.log('Generating phrases for:', { rating, hotelName, destination });
  
  // Rating-based phrases for luxury hotels
  const isLuxuryHotel = hotelName.toLowerCase().includes('hyatt') || 
                       hotelName.toLowerCase().includes('ritz') || 
                       hotelName.toLowerCase().includes('four seasons') ||
                       hotelName.toLowerCase().includes('mandarin') ||
                       hotelName.toLowerCase().includes('peninsula');

  if (isLuxuryHotel) {
    if (rating >= 4.5) {
      phrases.push("Exceptional luxury experience", "World-class service");
    } else {
      phrases.push("Luxury amenities", "Premium service");
    }
  } else {
    // Standard rating-based phrases
    if (rating >= 4.8) {
      phrases.push("Exceptional experience", "Outstanding service");
    } else if (rating >= 4.5) {
      phrases.push("Excellent choice", "Superior amenities");
    } else if (rating >= 4.0) {
      phrases.push("Great value", "Comfortable stay");
    } else {
      phrases.push("Good accommodation", "Pleasant stay");
    }
  }
  
  // Location-aware phrases
  if (destination) {
    const dest = destination.toLowerCase();
    // Asian destinations
    if (dest.includes('singapore')) {
      phrases.push("Prime Orchard Road location", "Near shopping district");
    } else if (dest.includes('tokyo') || dest.includes('japan')) {
      phrases.push("Excellent Japanese hospitality");
    } else if (dest.includes('bangkok') || dest.includes('thailand')) {
      phrases.push("Central Bangkok location");
    } else if (dest.includes('hong kong')) {
      phrases.push("Heart of Hong Kong");
    }
    // European destinations
    else if (dest.includes('paris')) {
      phrases.push("Perfect Parisian location");
    } else if (dest.includes('london')) {
      phrases.push("Prime London location");
    } else if (dest.includes('rome') || dest.includes('italy')) {
      phrases.push("Historic Italian setting");
    }
    // American destinations
    else if (dest.includes('new york') || dest.includes('manhattan')) {
      phrases.push("Central Manhattan location");
    } else {
      phrases.push("Convenient location");
    }
  }
  
  // Hotel type inference from name
  const name = hotelName.toLowerCase();
  if (name.includes('resort') || name.includes('villa')) {
    phrases.push("Resort amenities");
  } else if (name.includes('boutique')) {
    phrases.push("Unique boutique experience");
  } else if (name.includes('business') || name.includes('executive')) {
    phrases.push("Business-friendly facilities");
  }
  
  // Return 2-3 unique phrases
  const uniquePhrases = Array.from(new Set(phrases))
    .slice(0, isLuxuryHotel ? 3 : 2); // Luxury hotels get 3 phrases
  console.log('Generated phrases:', uniquePhrases);
  return uniquePhrases;
}

function generateFallbackHotelData(hotelName: string, destination: string = "Unknown"): Partial<Hotel> {
  // Generate realistic fallback data
  const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
  
  // Extract city from hotel name (take last word) if no destination provided
  let city = destination;
  if (destination === "Unknown" || !destination) {
    const words = hotelName.split(' ');
    city = words[words.length - 1];
  }

  const allPhrases = [
    "Comfortable accommodation",
    "Good location",
    "Friendly staff",
    "Clean rooms",
    "Value for money",
    "Modern facilities",
    "Convenient transport links",
    "Helpful concierge",
    "Well-maintained property",
    "Popular neighborhood",
    "Efficient check-in",
    "Professional service",
    "Peaceful atmosphere",
    "Central location",
    "Good amenities"
  ];

  // Select 2-3 random unique phrases
  const selectedPhrases = [...allPhrases]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 2);

  return {
    name: hotelName,
    city: city,
    rating: parseFloat(rating),
    phrases: selectedPhrases,
    fetchedFromAPI: false
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "search") {
      // Search for a specific hotel
      const { hotelName, destination } = SearchHotelSchema.parse(body);
      
      try {
        // For Grand Hyatt Singapore, use direct location ID
        if (hotelName.toLowerCase().includes('grand hyatt singapore')) {
          const locationId = '306175'; // Direct TripAdvisor location ID
          const details = await getTripAdvisorLocationDetails(locationId);
          
          if (details) {
            // Get additional photos
            const photos = await getTripAdvisorLocationPhotos(locationId);
            
            // Extract best available image URL
            let imageUrl = '';
            
            // Try photos first
            if (photos && photos.length > 0 && photos[0].images) {
              imageUrl = photos[0].images.large?.url || photos[0].images.medium?.url || '';
            }
            
            // Fallback to details photo
            if (!imageUrl && details.photo?.images) {
              imageUrl = details.photo.images.large?.url || details.photo.images.medium?.url || '';
            }
            
            // Parse rating
            const rating = details.rating ? parseFloat(details.rating) : 4.3;
            
            return NextResponse.json({
              success: true,
              data: {
                name: details.name || hotelName,
                city: 'Singapore',
                image: imageUrl,
                rating: rating,
                phrases: generateSmartPhrases(rating, details.name || hotelName, 'Singapore'),
                fetchedFromAPI: true
              }
            });
          }
        }

        // Regular search flow for other hotels
        const searchQuery = destination ? `${hotelName} ${destination}` : hotelName;
        console.log('Searching TripAdvisor for:', searchQuery);
        const searchResults = await searchTripAdvisorLocation(searchQuery);
         
        if (!searchResults || searchResults.length === 0) {
          return NextResponse.json({
            success: true,
            data: generateFallbackHotelData(hotelName, destination)
          });
        }

        // Get details for the first result (ONLY 1 API call now!)
        const firstResult = searchResults[0];
        const details = await getTripAdvisorLocationDetails(firstResult.location_id);
        
        if (!details) {
          return NextResponse.json({
            success: true,
            data: generateFallbackHotelData(hotelName, destination)
          });
        }

        // Get additional photos
        const photos = await getTripAdvisorLocationPhotos(firstResult.location_id);
        
        // Extract best available image URL
        let imageUrl = '';
        
        // Try photos first
        if (photos && photos.length > 0 && photos[0].images) {
          imageUrl = photos[0].images.large?.url || photos[0].images.medium?.url || '';
        }
        
        // Fallback to details photo
        if (!imageUrl && details.photo?.images) {
          imageUrl = details.photo.images.large?.url || details.photo.images.medium?.url || '';
        }
        
        // Final fallback to search result photo
        if (!imageUrl && firstResult.photo?.images) {
          imageUrl = firstResult.photo.images.large?.url || firstResult.photo.images.medium?.url || '';
        }
        
        // Parse rating (TripAdvisor returns as string)
        const rating = details.rating ? parseFloat(details.rating) : 4.2;
        
        // Extract city from location_string (e.g., "Singapore, Singapore" -> "Singapore")
        const extractCity = (locationString?: string) => {
          if (!locationString) return destination;
          // Split by comma and take the first part (usually the city)
          const parts = locationString.split(',').map(part => part.trim());
          return parts[0] || destination;
        };
        
        const city = extractCity(details.location_string || firstResult.location_string);
        
        return NextResponse.json({
          success: true,
          data: {
            name: details.name || hotelName,
            city: city,
            image: imageUrl,
            rating: rating,
            phrases: generateSmartPhrases(rating, details.name || hotelName, destination),
            fetchedFromAPI: true
          }
        });

      } catch (apiError) {
        console.error("TripAdvisor API error:", apiError);
        // Return fallback data on API failure
        return NextResponse.json({
          success: true,
          data: generateFallbackHotelData(hotelName, destination)
        });
      }

    } else if (action === "fetch_destination_hotels") {
      // Fetch suggested hotels for a destination
      const { destination, limit } = FetchHotelsSchema.parse(body);
      
      try {
        const searchResults = await searchTripAdvisorLocation(`hotels in ${destination}`);
        const hotels = [];
        
        for (let i = 0; i < Math.min(searchResults.length, limit); i++) {
          const result = searchResults[i];
          const details = await getTripAdvisorLocationDetails(result.location_id);
          
          if (details) {
            // Extract image URL from search result
            const imageUrl = result.photo?.images?.large?.url || result.photo?.images?.medium?.url || '';
            
            // Parse rating
            const rating = details.rating ? parseFloat(details.rating) : 4.2;
            
            // Extract city from location_string
            const extractCity = (locationString?: string) => {
              if (!locationString) return destination;
              const parts = locationString.split(',').map(part => part.trim());
              return parts[0] || destination;
            };
            
            const city = extractCity(details.location_string || result.location_string);
            
            hotels.push({
              name: details.name || result.name,
              city: city,
              image: imageUrl,
              rating: rating,
              phrases: generateSmartPhrases(rating, details.name || result.name, destination),
              fetchedFromAPI: true
            });
          }
        }
      
        return NextResponse.json({
          success: true,
          data: hotels
        });

      } catch (apiError) {
        console.error("TripAdvisor destination fetch error:", apiError);
        return NextResponse.json({
          success: false,
          error: "Failed to fetch destination hotels"
        }, { status: 500 });
      }

    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("TripAdvisor API error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 