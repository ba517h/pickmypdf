"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, MapPin, Star, Info } from "lucide-react";
import { ItineraryFormData } from "@/lib/types";

interface HighlightsStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function HighlightsStep({ data, onUpdate }: HighlightsStepProps) {
  const [newHotel, setNewHotel] = useState("");
  const [newExperience, setNewExperience] = useState("");
  const [newTip, setNewTip] = useState("");

  const addHotel = () => {
    if (newHotel.trim()) {
      const updatedHotels = [...data.hotels, newHotel.trim()];
      onUpdate({ hotels: updatedHotels });
      setNewHotel("");
    }
  };

  const removeHotel = (hotelToRemove: string) => {
    const updatedHotels = data.hotels.filter(hotel => hotel !== hotelToRemove);
    onUpdate({ hotels: updatedHotels });
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      const updatedExperiences = [...data.experiences, newExperience.trim()];
      onUpdate({ experiences: updatedExperiences });
      setNewExperience("");
    }
  };

  const removeExperience = (experienceToRemove: string) => {
    const updatedExperiences = data.experiences.filter(exp => exp !== experienceToRemove);
    onUpdate({ experiences: updatedExperiences });
  };

  const addTip = () => {
    if (newTip.trim()) {
      const updatedTips = [...data.practicalInfo.tips, newTip.trim()];
      onUpdate({
        practicalInfo: {
          ...data.practicalInfo,
          tips: updatedTips
        }
      });
      setNewTip("");
    }
  };

  const removeTip = (tipToRemove: string) => {
    const updatedTips = data.practicalInfo.tips.filter(tip => tip !== tipToRemove);
    onUpdate({
      practicalInfo: {
        ...data.practicalInfo,
        tips: updatedTips
      }
    });
  };

  const handlePracticalInfoChange = (field: 'visa' | 'currency', value: string) => {
    onUpdate({
      practicalInfo: {
        ...data.practicalInfo,
        [field]: value
      }
    });
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-8">
      {/* Hotels Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Hotels & Accommodations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add hotel or accommodation"
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addHotel)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addHotel}
              disabled={!newHotel.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {data.hotels.length > 0 && (
            <div className="space-y-2">
              {data.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{hotel}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHotel(hotel)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Add hotels, hostels, Airbnbs, or other accommodations you recommend
          </p>
        </CardContent>
      </Card>

      {/* Experiences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Highlight Experiences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a highlight experience"
              value={newExperience}
              onChange={(e) => setNewExperience(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addExperience)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              disabled={!newExperience.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {data.experiences.length > 0 && (
            <div className="space-y-2">
              {data.experiences.map((experience, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{experience}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(experience)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Must-do activities, tours, restaurants, or unique experiences
          </p>
        </CardContent>
      </Card>

      {/* Practical Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Practical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visa Information */}
          <div className="space-y-2">
            <Label htmlFor="visa">Visa Requirements</Label>
            <Textarea
              id="visa"
              placeholder="e.g., Tourist visa required for stays over 30 days. Visa on arrival available for most countries."
              value={data.practicalInfo.visa}
              onChange={(e) => handlePracticalInfoChange("visa", e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Currency Information */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency & Budget Info</Label>
            <Textarea
              id="currency"
              placeholder="e.g., Thai Baht (THB). 1 USD ≈ 35 THB. Budget: $30-50/day for mid-range travel."
              value={data.practicalInfo.currency}
              onChange={(e) => handlePracticalInfoChange("currency", e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Travel Tips */}
          <div className="space-y-4">
            <Label>Travel Tips</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a travel tip"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTip)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTip}
                disabled={!newTip.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {data.practicalInfo.tips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.practicalInfo.tips.map((tip, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tip}
                    <button
                      type="button"
                      onClick={() => removeTip(tip)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Essential tips for travelers (e.g., &quot;Download offline maps&quot;, &quot;Bring insect repellent&quot;)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 