"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ItineraryFormData } from "@/app/itinerary/page";

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
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
          Countries, cities, or regions you'll be visiting
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

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
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