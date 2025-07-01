"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Star, RefreshCw, MapPin, Edit3, Check, Loader2 } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface AccommodationsStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

interface Hotel {
  name: string;
  city?: string;
  nights?: number;
  image?: string;
  rating?: number;
  phrases?: string[];
  fetchedFromAPI?: boolean;
}

export function AccommodationsStep({ data, onUpdate, form }: AccommodationsStepProps) {
  const [newHotel, setNewHotel] = useState("");
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [isFetchingFromDestination, setIsFetchingFromDestination] = useState(false);
  const [fetchingStates, setFetchingStates] = useState<Record<string, boolean>>({});
  const [editingFields, setEditingFields] = useState<Record<string, { name?: boolean; city?: boolean; nights?: boolean; phrases?: boolean }>>({});
  const [tempValues, setTempValues] = useState<Record<string, { name?: string; city?: string; nights?: number; phrases?: string }>>({});
  
  const { toast } = useToast();

  // Fetch hotel data from TripAdvisor
  const fetchHotelFromTripAdvisor = async (hotelName: string, destination?: string): Promise<Partial<Hotel>> => {
    try {
      const response = await fetch('/api/tripadvisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          hotelName,
          destination: destination || data.destination || ""
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('TripAdvisor API error:', result.error);
        throw new Error(result.error || 'Failed to fetch hotel data');
      }

      // Verify the hotel name matches what we searched for (case-insensitive)
      const searchedName = hotelName.toLowerCase().trim();
      const returnedName = result.data.name.toLowerCase().trim();
      
      // If the returned hotel name is completely different, use fallback
      if (!returnedName.includes(searchedName) && !searchedName.includes(returnedName)) {
        console.log('Hotel name mismatch:', { searched: hotelName, returned: result.data.name });
        return generateFallbackHotelData(hotelName, destination);
      }

      // Ensure we have phrases from the API
      if (!result.data.phrases || result.data.phrases.length === 0) {
        console.error('No phrases returned from TripAdvisor API');
        return generateFallbackHotelData(hotelName, destination);
      }

      return result.data;
    } catch (error) {
      console.error('TripAdvisor fetch error:', error);
      return generateFallbackHotelData(hotelName, destination);
    }
  };

  // Helper function to generate fallback hotel data
  const generateFallbackHotelData = (hotelName: string, destination?: string): Partial<Hotel> => {
    const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
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

    // Generate a unique image URL for this hotel
    const imageId = Math.floor(Math.random() * 1000) + 1;
    const fallbackImage = `https://picsum.photos/800/600?random=${imageId}`;

    return {
      name: hotelName,
      city: destination || data.destination || "",
      rating: parseFloat(rating),
      phrases: selectedPhrases,
      fetchedFromAPI: false,
      image: fallbackImage
    };
  };

  // Add hotel with TripAdvisor integration
  const addHotel = async () => {
    if (!newHotel.trim()) return;
    
      const existingHotels = data.hotels || [];
    if (existingHotels.some(hotel => hotel.name.toLowerCase() === newHotel.trim().toLowerCase())) {
      toast({
        title: "Hotel already exists",
        description: "This hotel is already in your list.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingHotel(true);
    
    try {
      // Extract hotel name and potential city
      const hotelNameParts = newHotel.split(',').map(part => part.trim());
      const hotelName = hotelNameParts[0];
      
      // Try to extract city from hotel name for well-known hotels
      let inferredCity = '';
      const lastWord = hotelName.split(' ').pop() || '';
      const knownCities = ['Singapore', 'Bangkok', 'Tokyo', 'Paris', 'London', 'Sydney'];
      if (knownCities.includes(lastWord)) {
        inferredCity = lastWord;
      } else if (hotelNameParts.length > 1) {
        // If hotel name includes city after comma
        inferredCity = hotelNameParts[1];
      }
      
      // First add the hotel with basic info
      const basicHotel: Hotel = {
        name: hotelName,
        city: inferredCity || data.destination || "",
        nights: 2,
        rating: undefined,
        phrases: ["Premium accommodation with excellent amenities"],
        fetchedFromAPI: false,
        // Add a temporary fallback image that will be replaced if TripAdvisor succeeds
        image: `https://picsum.photos/800/600?random=${Date.now()}`
      };

      // Then fetch from TripAdvisor
      const tripAdvisorData = await fetchHotelFromTripAdvisor(hotelName, inferredCity || data.destination);
      
      // Create enhanced hotel data
      const enhancedHotel = { 
        ...basicHotel,
        ...tripAdvisorData,
        // Keep original name
        name: basicHotel.name,
        // Use TripAdvisor city if available, otherwise keep inferred or destination
        city: tripAdvisorData.city || basicHotel.city || data.destination,
        // Ensure image URL is properly formatted
        image: tripAdvisorData.image 
          ? `https://images.weserv.nl/?url=${encodeURIComponent(tripAdvisorData.image)}&w=800&h=600&fit=cover&output=jpg&q=75&n=${Date.now()}` 
          : basicHotel.image,
        // Ensure we have some phrases
        phrases: tripAdvisorData.phrases || ["Premium accommodation with excellent amenities"],
        // Mark as fetched from API
        fetchedFromAPI: tripAdvisorData.fetchedFromAPI
      };

      // Check if we already have a hotel in this city
      const city = (enhancedHotel.city || data.destination || 'Unknown').toLowerCase();
      const existingCityHotel = existingHotels.find(h => 
        (h.city || data.destination || 'Unknown').toLowerCase() === city
      );

      if (existingCityHotel) {
        // Compare ratings
        const newRating = enhancedHotel.rating || 0;
        const existingRating = existingCityHotel.rating || 0;

        if (newRating <= existingRating) {
          toast({
            title: "Hotel not added",
            description: `A higher-rated hotel (${existingCityHotel.name}) already exists in ${enhancedHotel.city}.`,
            variant: "destructive"
          });
          setNewHotel("");
          setIsAddingHotel(false);
          return;
        } else {
          // Remove the lower-rated hotel
          const updatedHotels = existingHotels.filter(h => h !== existingCityHotel);
          updatedHotels.push(enhancedHotel);
          onUpdate({ hotels: updatedHotels });
          toast({
            title: "Hotel replaced",
            description: `Replaced ${existingCityHotel.name} with higher-rated ${enhancedHotel.name} in ${enhancedHotel.city}.`,
          });
        }
      } else {
        // No hotel in this city yet, just add it
        const updatedHotels = [...existingHotels, enhancedHotel];
        onUpdate({ hotels: updatedHotels });
        
        if (tripAdvisorData.fetchedFromAPI) {
          toast({
            title: "Hotel added",
            description: "Successfully loaded hotel details.",
          });
        }
      }

        setNewHotel("");
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast({
        title: "Error adding hotel",
        description: "Could not fetch hotel details.",
        variant: "destructive"
      });
    } finally {
      setIsAddingHotel(false);
    }
  };

  // Fetch hotels from destination
  const fetchHotelsFromDestination = async () => {
    if (!data.destination) {
      toast({
        title: "No destination set",
        description: "Please set a destination first.",
        variant: "destructive"
      });
      return;
    }

    setIsFetchingFromDestination(true);

    try {
      const response = await fetch('/api/tripadvisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_destination_hotels',
          destination: data.destination,
          limit: 10 // Fetch more to ensure we have enough after filtering
        })
      });

      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        const existingHotels = data.hotels || [];
        const existingNames = existingHotels.map(h => h.name.toLowerCase());
        const existingCities = existingHotels.map(h => h.city?.toLowerCase());
        
        // Group hotels by city
        const hotelsByCity = (result.data as Hotel[]).reduce((acc: Record<string, Hotel[]>, hotel: Hotel) => {
          const city = (hotel.city || data.destination || 'Unknown').toLowerCase();
          if (!acc[city]) {
            acc[city] = [];
          }
          acc[city].push(hotel);
          return acc;
        }, {} as Record<string, Hotel[]>);

        // Take the best rated hotel from each city that's not already in the list
        const newHotels = Object.values(hotelsByCity)
          .map((cityHotels: Hotel[]) => {
            // Sort by rating and take the best one
            return cityHotels.sort((a: Hotel, b: Hotel) => (b.rating || 0) - (a.rating || 0))[0];
          })
          .filter(hotel => {
            const city = (hotel.city || data.destination || 'Unknown').toLowerCase();
            return !existingNames.includes(hotel.name.toLowerCase()) && 
                   !existingCities.includes(city);
          });

        if (newHotels.length > 0) {
          const updatedHotels = [...existingHotels, ...newHotels];
          onUpdate({ hotels: updatedHotels });
          
          toast({
            title: "Hotels added",
            description: `Added ${newHotels.length} top-rated hotels from different cities in ${data.destination}.`,
          });
        } else {
          toast({
            title: "No new hotels",
            description: "All suggested hotels are already in your list or their cities are already covered.",
          });
        }
      } else {
        throw new Error('No hotels found');
      }
    } catch (error) {
      toast({
        title: "Failed to fetch hotels",
        description: "Could not load hotels from destination.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingFromDestination(false);
    }
  };

  // Retry TripAdvisor fetch for specific hotel
  const retryTripAdvisorFetch = async (hotelName: string) => {
    setFetchingStates(prev => ({ ...prev, [hotelName]: true }));

    try {
      const hotel = data.hotels.find(h => h.name === hotelName);
      if (!hotel) return;

      const tripAdvisorData = await fetchHotelFromTripAdvisor(hotelName, hotel.city || data.destination);
      
      // Update all fields with proper formatting
      const updatedHotels = data.hotels.map(h =>
        h.name === hotelName 
          ? { 
              ...h,
              ...tripAdvisorData,
              // Keep original name to ensure it's never undefined
              name: hotelName,
              // Keep original city if API city is empty
              city: tripAdvisorData.city || h.city || data.destination,
              // Ensure image URL is properly formatted
              image: tripAdvisorData.image ? `https://images.weserv.nl/?url=${encodeURIComponent(tripAdvisorData.image)}&w=800&output=jpg&q=75` : h.image,
              // Ensure we have some phrases
              phrases: tripAdvisorData.phrases || ["Premium accommodation with excellent amenities"],
              // Mark as fetched from API
              fetchedFromAPI: tripAdvisorData.fetchedFromAPI
            }
          : h
      );
      
      onUpdate({ hotels: updatedHotels });
      
      toast({
        title: "Hotel data updated",
        description: tripAdvisorData.fetchedFromAPI 
          ? "Successfully updated from TripAdvisor."
          : "Updated with fallback data.",
      });

    } catch (error) {
      console.error('Error fetching hotel data:', error);
      toast({
        title: "Fetch failed",
        description: "Could not update hotel data.",
        variant: "destructive"
      });
    } finally {
      setFetchingStates(prev => ({ ...prev, [hotelName]: false }));
    }
  };

  // Remove hotel
  const removeHotel = (nameToRemove: string) => {
    const updatedHotels = (data.hotels || []).filter(hotel => hotel.name !== nameToRemove);
    onUpdate({ hotels: updatedHotels });
  };

  // Update hotel image
  const updateHotelImage = (name: string, imageUrl: string) => {
    const updatedHotels = data.hotels.map(hotel =>
      hotel.name === name
        ? {
            ...hotel,
            // Handle different image URL types
            image: imageUrl.startsWith('data:') 
              ? imageUrl 
              : imageUrl.includes('images.weserv.nl')
                ? imageUrl
                : imageUrl 
                  ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=800&h=600&fit=cover&output=jpg&q=75&n=${Date.now()}` 
                  : `https://picsum.photos/800/600?random=${Date.now()}`
          }
        : hotel
    );
    onUpdate({ hotels: updatedHotels });
  };

  // Start editing field
  const startEditing = (hotelName: string, field: 'name' | 'city' | 'nights' | 'phrases') => {
    setEditingFields(prev => ({
      ...prev,
      [hotelName]: { ...prev[hotelName], [field]: true }
    }));
    
    const hotel = data.hotels?.find(h => h.name === hotelName);
    if (hotel) {
      setTempValues(prev => ({
        ...prev,
        [hotelName]: { 
          ...prev[hotelName], 
          [field]: field === 'name' ? hotel.name : 
                   field === 'city' ? (hotel.city || '') :
                   field === 'nights' ? (hotel.nights || 2) :
                   (hotel.phrases?.join(', ') || '')
        }
      }));
    }
  };

  // Save edited field
  const saveEdit = (hotelName: string, field: 'name' | 'city' | 'nights' | 'phrases') => {
    const newValue = tempValues[hotelName]?.[field];
    if (newValue !== undefined) {
      const updatedHotels = (data.hotels || []).map(hotel => {
        if (hotel.name === hotelName) {
          if (field === 'phrases' && typeof newValue === 'string') {
            // Convert comma-separated string to array for phrases
            const phrasesArray = newValue.split(',').map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);
            return { ...hotel, phrases: phrasesArray };
          } else {
            // Handle other fields normally
            return { ...hotel, [field]: newValue };
          }
        }
        return hotel;
      });
      onUpdate({ hotels: updatedHotels });
    }
    
    setEditingFields(prev => ({
      ...prev,
      [hotelName]: { ...prev[hotelName], [field]: false }
    }));
  };

  // Cancel editing
  const cancelEdit = (hotelName: string, field: 'name' | 'city' | 'nights' | 'phrases') => {
    setEditingFields(prev => ({
      ...prev,
      [hotelName]: { ...prev[hotelName], [field]: false }
    }));
  };

  // Update rating
  const updateRating = (hotelName: string, rating: number) => {
    const updatedHotels = (data.hotels || []).map(hotel =>
      hotel.name === hotelName ? { ...hotel, rating } : hotel
    );
    onUpdate({ hotels: updatedHotels });
  };

  // Generate star display
  const renderStars = (rating?: number, hotelName?: string, editable = false) => {
    const displayRating = rating || 0;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          
          return (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                isFilled || isHalf 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } ${editable ? 'cursor-pointer hover:text-yellow-500' : ''}`}
              onClick={editable && hotelName ? () => updateRating(hotelName, i + 1) : undefined}
            />
          );
        })}
        {rating && (
          <span className="text-sm text-gray-600 ml-2">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  // Get rating badge style
  const getRatingBadgeStyle = (rating?: number) => {
    if (!rating) return "bg-gray-100 text-gray-600";
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 4.0) return "bg-blue-100 text-blue-800";
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Get rating label
  const getRatingLabel = (rating?: number) => {
    if (!rating) return "Not rated";
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Fair";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHotel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Accommodations</h2>
        <p className="text-muted-foreground">
          Add hotels with real ratings and smart phrases from TripAdvisor
        </p>
      </div>

      {/* Add new hotel */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="w-4 h-4" />
            Add Hotel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Marriott Bangkok, Grand Hyatt Singapore"
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 font-medium"
              disabled={isAddingHotel}
            />
            <Button 
              onClick={addHotel} 
              disabled={!newHotel.trim() || isAddingHotel} 
              size="sm"
            >
              {isAddingHotel ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
              <Plus className="w-4 h-4 mr-1" />
              )}
              Add
            </Button>
          </div>
          

        </CardContent>
      </Card>

      {/* Hotels list */}
      {data.hotels && data.hotels.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hotels ({data.hotels.length})</h3>
          
          <div className="space-y-4">
            {data.hotels.map((hotel, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image Section */}
                    <div className="w-32 flex-shrink-0">
                      <ImageInput
                        value={hotel.image}
                        onChange={(imageUrl) => updateHotelImage(hotel.name, imageUrl)}
                        placeholder={`${hotel.name}`}
                        className="w-full h-24"
                        compact={false}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Hotel Name - Editable */}
                          <div>
                            {!hotel.fetchedFromAPI && (
                              <Badge variant="outline" className="mb-2 text-xs text-muted-foreground">
                                Sample Data
                              </Badge>
                            )}
                            {editingFields[hotel.name]?.name ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={tempValues[hotel.name]?.name || ''}
                                  onChange={(e) => setTempValues(prev => ({
                                    ...prev,
                                    [hotel.name]: { ...prev[hotel.name], name: e.target.value }
                                  }))}
                                  className="font-semibold text-lg"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => saveEdit(hotel.name, 'name')}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => cancelEdit(hotel.name, 'name')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <h4 className="font-semibold text-lg text-gray-900">{hotel.name}</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(hotel.name, 'name')}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* City and Nights - Editable */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* City */}
                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">City</Label>
                              {editingFields[hotel.name]?.city ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={tempValues[hotel.name]?.city || ''}
                                    onChange={(e) => setTempValues(prev => ({
                                      ...prev,
                                      [hotel.name]: { ...prev[hotel.name], city: e.target.value }
                                    }))}
                                    className="text-sm"
                                    placeholder="City name"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => saveEdit(hotel.name, 'city')}
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => cancelEdit(hotel.name, 'city')}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="text-sm text-gray-600 p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 group"
                                  onClick={() => startEditing(hotel.name, 'city')}
                                >
                                  <span>{hotel.city || "Add city..."}</span>
                                  <Edit3 className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100" />
                                </div>
                              )}
                            </div>

                            {/* Nights */}
                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Nights</Label>
                              {editingFields[hotel.name]?.nights ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={tempValues[hotel.name]?.nights || 2}
                                    onChange={(e) => setTempValues(prev => ({
                                      ...prev,
                                      [hotel.name]: { ...prev[hotel.name], nights: parseInt(e.target.value) || 2 }
                                    }))}
                                    className="text-sm"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => saveEdit(hotel.name, 'nights')}
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => cancelEdit(hotel.name, 'nights')}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="text-sm text-gray-600 p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 group"
                                  onClick={() => startEditing(hotel.name, 'nights')}
                                >
                                  <span>{hotel.nights || 2} nights</span>
                                  <Edit3 className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Rating Section */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              {renderStars(hotel.rating, hotel.name, true)}
                              <Badge className={getRatingBadgeStyle(hotel.rating)}>
                                {getRatingLabel(hotel.rating)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Click stars to edit rating
                            </p>
                          </div>

                          {/* Phrases Section - Editable */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Label className="text-xs font-semibold text-muted-foreground">Review Phrases</Label>
                              {!hotel.fetchedFromAPI && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  Sample Reviews
                                </Badge>
                              )}
                            </div>
                            {editingFields[hotel.name]?.phrases ? (
                              <div className="space-y-2">
                                <Input
                                  value={tempValues[hotel.name]?.phrases || ''}
                                  onChange={(e) => setTempValues(prev => ({
                                    ...prev,
                                    [hotel.name]: { ...prev[hotel.name], phrases: e.target.value }
                                  }))}
                                  placeholder="Enter review phrases separated by commas (e.g., Great location, Excellent service)"
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => saveEdit(hotel.name, 'phrases')}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => cancelEdit(hotel.name, 'phrases')}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Separate multiple phrases with commas
                                </p>
                              </div>
                            ) : (
                              <div 
                                className="cursor-pointer"
                                onClick={() => startEditing(hotel.name, 'phrases')}
                              >
                                <div className="min-h-[32px] p-2 bg-gray-50 rounded border hover:bg-gray-100 flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    {hotel.phrases && hotel.phrases.length > 0 
                                      ? hotel.phrases.join(', ')
                                      : 'Click to add review phrases...'
                                    }
                                  </span>
                                  <Edit3 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHotel(hotel.name)}
                          className="h-8 w-8 p-0 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!data.hotels || data.hotels.length === 0) && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-8 pb-8 text-center">
            <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels added yet</h3>
            <p className="text-gray-600 mb-4">
              Add hotels to get real ratings and smart phrases from TripAdvisor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 