"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface OverviewStepProps {
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

export function OverviewStep({ data, onUpdate, form }: OverviewStepProps) {
  const [newTag, setNewTag] = useState("");
  const [newCity, setNewCity] = useState("");

  const handleInputChange = (field: keyof ItineraryFormData, value: string) => {
    onUpdate({ [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      const updatedTags = [...data.tags, newTag.trim()];
      onUpdate({ tags: updatedTags });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = data.tags.filter(tag => tag !== tagToRemove);
    onUpdate({ tags: updatedTags });
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

  const handleKeyPress = (e: React.KeyboardEvent, action: 'tag' | 'city') => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (action === 'tag') addTag();
      if (action === 'city') addCity();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Itinerary Image */}
      <Card>
        <CardHeader>
          <CardTitle>Main Itinerary Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageInput
            value={data.mainImage}
            onChange={(value) => onUpdate({ mainImage: value })}
            keywords={`${data.destination || 'travel'} destination landscape`}
            placeholder="Main itinerary cover image"
          />
        </CardContent>
      </Card>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Trip Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Amazing Southeast Asia Adventure"
          value={data.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Give your itinerary a compelling title
        </p>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination">Destination *</Label>
        <Input
          id="destination"
          placeholder="e.g., Thailand, Vietnam, Cambodia"
          value={data.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Countries, cities, or regions you&apos;ll be visiting
        </p>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duration *</Label>
        <Input
          id="duration"
          placeholder="e.g., 14 days, 2 weeks, 10 days 9 nights"
          value={data.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          How long is your trip?
        </p>
      </div>

      {/* Routing */}
      <div className="space-y-2">
        <Label htmlFor="routing">Routing</Label>
        <Textarea
          id="routing"
          placeholder="e.g., Bangkok → Chiang Mai → Hanoi → Ho Chi Minh City → Siem Reap → Bangkok"
          value={data.routing}
          onChange={(e) => handleInputChange("routing", e.target.value)}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Describe your travel route and major stops
        </p>
      </div>

      {/* Trip Type */}
      <div className="space-y-2">
        <Label>Trip Type</Label>
        <Select
          value={data.tripType}
          onValueChange={(value) => handleInputChange("tripType", value)}
        >
          <SelectTrigger>
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
        <p className="text-sm text-muted-foreground">
          What kind of trip is this?
        </p>
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
              onKeyPress={(e) => handleKeyPress(e, 'city')}
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

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'tag')}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTag}
            disabled={!newTag.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Add tags to categorize your trip (e.g., budget, foodie, nature)
        </p>
      </div>
    </div>
  );
} 