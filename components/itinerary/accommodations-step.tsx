"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Star } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface AccommodationsStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function AccommodationsStep({ data, onUpdate, form }: AccommodationsStepProps) {
  const [newHotel, setNewHotel] = useState("");

  const addHotel = () => {
    if (newHotel.trim()) {
      const existingHotels = data.hotels || [];
      if (!existingHotels.some(hotel => hotel.name === newHotel.trim())) {
        const updatedHotels = [...existingHotels, { name: newHotel.trim(), image: "" }];
        onUpdate({ hotels: updatedHotels });
        setNewHotel("");
      }
    }
  };

  const removeHotel = (nameToRemove: string) => {
    const updatedHotels = (data.hotels || []).filter(hotel => hotel.name !== nameToRemove);
    onUpdate({ hotels: updatedHotels });
  };

  const updateHotelImage = (name: string, imageUrl: string) => {
    const updatedHotels = (data.hotels || []).map(hotel =>
      hotel.name === name ? { ...hotel, image: imageUrl } : hotel
    );
    onUpdate({ hotels: updatedHotels });
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
          Add hotels and accommodations for your trip
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
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Marriott Bangkok, Grand Hyatt Singapore"
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 font-medium"
            />
            <Button onClick={addHotel} disabled={!newHotel.trim()} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hotels list */}
      {data.hotels && data.hotels.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hotels ({data.hotels.length})</h3>
          
          <div className="space-y-3">
            {data.hotels.map((hotel, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    {/* Image Section */}
                    <div className="w-28 flex-shrink-0">
                      <Label className="text-xs font-semibold text-muted-foreground mb-2 block">Image</Label>
                      <ImageInput
                        value={hotel.image}
                        onChange={(imageUrl) => updateHotelImage(hotel.name, imageUrl)}
                        keywords={`${hotel.name} ${data.destination || ''} hotel accommodation luxury`}
                        placeholder={`${hotel.name}`}
                        className="w-full"
                        compact={true}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-base text-gray-900 mb-1">{hotel.name}</h4>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">Luxury Hotel</span>
                          </div>
                          <p className="text-sm text-gray-600">Premium accommodation with excellent amenities</p>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHotel(hotel.name)}
                          className="h-8 w-8 p-0 hover:text-destructive ml-2"
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
              Add hotels and accommodations to showcase where you&apos;ll be staying
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 