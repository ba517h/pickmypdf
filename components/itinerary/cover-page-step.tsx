"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface CoverPageStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function CoverPageStep({ data, onUpdate, form }: CoverPageStepProps) {
  const [newTag, setNewTag] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const recommendedTags = ["Adventure", "Cultural", "Photography", "Foodie", "Budget", "Luxury", "Nature", "Urban", "Beach", "Mountains", "Backpacking", "Family-Friendly"];

  const handleInputChange = (field: keyof ItineraryFormData, value: string) => {
    onUpdate({ [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      const updatedTags = [...data.tags, newTag.trim()];
      onUpdate({ tags: updatedTags });
      setNewTag("");
      setShowCustomInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = data.tags.filter(tag => tag !== tagToRemove);
    onUpdate({ tags: updatedTags });
  };

  const addRecommendedTag = (tag: string) => {
    if (!data.tags.includes(tag)) {
      const updatedTags = [...data.tags, tag];
      onUpdate({ tags: updatedTags });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Cover Page</h2>
        <p className="text-muted-foreground">
          Create an attractive cover page for your travel itinerary
        </p>
      </div>

      {/* Main Itinerary Image */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
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
        <Label htmlFor="title" className="font-semibold text-muted-foreground">Trip Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Amazing Southeast Asia Adventure"
          value={data.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="font-medium"
        />
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="font-semibold text-muted-foreground">Destination *</Label>
        <Input
          id="destination"
          placeholder="e.g., Thailand, Vietnam, Cambodia"
          value={data.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
          className="font-medium"
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration" className="font-semibold text-muted-foreground">Duration *</Label>
        <Input
          id="duration"
          placeholder="e.g., 14 days, 2 weeks, 10 days 9 nights"
          value={data.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          className="font-medium"
        />
      </div>

      {/* Cost in INR */}
      <div className="space-y-2">
        <Label htmlFor="costInINR" className="font-semibold text-muted-foreground">Estimated Cost (₹)</Label>
        <Input
          id="costInINR"
          placeholder="e.g., 1,42,000 / person"
          value={data.costInINR || "1,42,000 / person"}
          onChange={(e) => onUpdate({ costInINR: e.target.value })}
          className="font-medium"
        />
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <Label className="font-semibold text-muted-foreground">Tags</Label>
        
        {/* Tag Pills - Selected first, then recommendations, then custom */}
        <div className="flex flex-wrap gap-2">
          {/* Selected tags first - with checkmark */}
          {data.tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                ✓ {tag}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-6 w-6 p-0 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          
          {/* Unselected recommended tags */}
          {recommendedTags
            .filter(tag => !data.tags.includes(tag))
            .map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addRecommendedTag(tag)}
                className="text-xs h-7"
              >
                + {tag}
              </Button>
            ))}
          
          {/* Custom tag pill */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs h-7 border-dashed"
          >
            + Add Custom
          </Button>
        </div>

        {/* Custom Tag Input - shown when custom pill is clicked */}
        {showCustomInput && (
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Enter custom tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              className="font-medium"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCustomInput(false);
                setNewTag("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          Tags help categorize your trip and will appear on the cover page
        </p>
      </div>
    </div>
  );
} 