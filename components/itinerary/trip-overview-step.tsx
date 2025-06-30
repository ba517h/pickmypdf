"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface TripOverviewStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

const tripTypes = [
  "Adventure",
  "Relaxation", 
  "Cultural",
  "Business",
  "Family",
  "Romantic",
  "Solo Travel",
  "Group Travel",
  "Backpacking",
  "Luxury"
];

export function TripOverviewStep({ data, onUpdate, form }: TripOverviewStepProps) {
  const [newCity, setNewCity] = useState("");

  const handleInputChange = (field: keyof ItineraryFormData, value: string) => {
    onUpdate({ [field]: value });
  };

  const addCity = () => {
    if (newCity.trim()) {
      const existingCities = data.cityImages || [];
      if (!existingCities.some(city => city.city === newCity.trim())) {
        const updatedCities = [...existingCities, { city: newCity.trim(), image: "" }];
        onUpdate({ cityImages: updatedCities });
        setNewCity("");
      }
    }
  };

  const removeCity = (cityToRemove: string) => {
    const updatedCities = (data.cityImages || []).filter(city => city.city !== cityToRemove);
    onUpdate({ cityImages: updatedCities });
  };

  const updateCityImage = (cityName: string, imageUrl: string) => {
    const updatedCities = (data.cityImages || []).map(city =>
      city.city === cityName ? { ...city, image: imageUrl } : city
    );
    onUpdate({ cityImages: updatedCities });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCity();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Trip Overview</h2>
        <p className="text-muted-foreground">
          Provide detailed information about your travel route and trip style
        </p>
      </div>

      {/* Routing */}
      <div className="space-y-2">
        <Label htmlFor="routing" className="font-semibold text-muted-foreground">Routing</Label>
        <Textarea
          id="routing"
          placeholder="e.g., Bangkok → Chiang Mai → Hanoi → Ho Chi Minh City → Siem Reap → Bangkok"
          value={data.routing}
          onChange={(e) => handleInputChange("routing", e.target.value)}
          rows={3}
          className="font-medium"
        />
      </div>

      {/* Trip Type */}
      <div className="space-y-2">
        <Label className="font-semibold text-muted-foreground">Trip Type</Label>
        <Select
          value={data.tripType}
          onValueChange={(value) => handleInputChange("tripType", value)}
        >
          <SelectTrigger className="font-medium">
            <SelectValue placeholder="Select trip type" />
          </SelectTrigger>
          <SelectContent>
            {tripTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Images */}
      <Card>
        <CardHeader>
          <CardTitle>City Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a city"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-medium"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCity}
              disabled={!newCity.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {data.cityImages && data.cityImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.cityImages.map((city) => (
                <Card key={city.city} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {city.city}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCity(city.city)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageInput
                      value={city.image}
                      onChange={(value) => updateCityImage(city.city, value)}
                      keywords={`${city.city} city landmarks architecture`}
                      placeholder={`${city.city} city image`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Add images for specific cities in your itinerary
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 