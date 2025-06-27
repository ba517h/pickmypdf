"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Heart, Compass } from "lucide-react";
import { ItineraryFormData } from "@/app/itinerary/page";

interface OptionalBlocksStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function OptionalBlocksStep({ data, onUpdate }: OptionalBlocksStepProps) {
  const handleInputChange = (field: 'withKids' | 'withFamily' | 'offbeatSuggestions', value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Optional Travel Sections</h3>
        <p className="text-muted-foreground">
          Add specialized recommendations for different types of travelers. These sections are optional but can make your itinerary more comprehensive.
        </p>
      </div>

      {/* With Kids Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Traveling with Kids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="withKids">Kid-Friendly Recommendations</Label>
            <Textarea
              id="withKids"
              placeholder="Share tips and recommendations for families traveling with children...

Examples:
• Child-friendly restaurants with high chairs and kids menus
• Family-oriented activities and attractions
• Safety considerations and health tips
• Accommodation recommendations (family rooms, cribs available)
• Transportation tips for traveling with kids
• Entertainment ideas for long travel days
• Local parks and playgrounds"
              value={data.withKids}
              onChange={(e) => handleInputChange("withKids", e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Include family-friendly activities, safety tips, and practical advice for parents
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* With Family Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Family Travel Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="withFamily">Multi-Generational Travel</Label>
            <Textarea
              id="withFamily"
              placeholder="Recommendations for traveling with extended family or multiple generations...

Examples:
• Accommodations suitable for larger groups
• Activities that appeal to different age groups
• Accessibility considerations for elderly travelers
• Group dining options and reservation tips
• Transportation for larger groups
• Pace considerations and rest stops
• Cultural experiences that bring families together"
              value={data.withFamily}
              onChange={(e) => handleInputChange("withFamily", e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Consider different ages, interests, and mobility needs within the family
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Offbeat/Wildcard Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-green-500" />
            Offbeat & Wildcard Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="offbeatSuggestions">Hidden Gems & Unique Experiences</Label>
            <Textarea
              id="offbeatSuggestions"
              placeholder="Share lesser-known attractions, local secrets, and unique experiences...

Examples:
• Hidden local markets and street food spots
• Off-the-beaten-path attractions
• Unique local experiences or festivals
• Secret viewpoints and photo spots
• Local workshops or cultural immersion activities
• Alternative routes or transportation methods
• Quirky accommodations or unique stays
• Seasonal or special event recommendations"
              value={data.offbeatSuggestions}
              onChange={(e) => handleInputChange("offbeatSuggestions", e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Include unconventional experiences that adventurous travelers might enjoy
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">💡 Pro Tips for Optional Sections</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• These sections help differentiate your itinerary and add value</li>
          <li>• Consider your target audience when filling these out</li>
          <li>• You can leave sections blank if they don't apply to your trip</li>
          <li>• Include practical details like costs, booking requirements, or advance planning needed</li>
        </ul>
      </div>
    </div>
  );
} 