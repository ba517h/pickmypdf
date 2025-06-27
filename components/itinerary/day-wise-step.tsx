"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Clock } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface DayWiseStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

interface DayItem {
  day: number;
  title: string;
  content: string;
  image?: string;
}

export function DayWiseStep({ data, onUpdate }: DayWiseStepProps) {
  const addDay = () => {
    const newDay: DayItem = {
      day: data.dayWiseItinerary.length + 1,
      title: "",
      content: "",
      image: ""
    };
    const updatedItinerary = [...data.dayWiseItinerary, newDay];
    onUpdate({ dayWiseItinerary: updatedItinerary });
  };

  const removeDay = (dayToRemove: number) => {
    const updatedItinerary = data.dayWiseItinerary
      .filter(item => item.day !== dayToRemove)
      .map((item, index) => ({ ...item, day: index + 1 }));
    onUpdate({ dayWiseItinerary: updatedItinerary });
  };

  const updateDay = (dayNumber: number, field: 'title' | 'content', value: string) => {
    const updatedItinerary = data.dayWiseItinerary.map(item =>
      item.day === dayNumber
        ? { ...item, [field]: value }
        : item
    );
    onUpdate({ dayWiseItinerary: updatedItinerary });
  };

  const updateDayImage = (dayNumber: number, imageUrl: string) => {
    const updatedItinerary = data.dayWiseItinerary.map(item =>
      item.day === dayNumber
        ? { ...item, image: imageUrl }
        : item
    );
    onUpdate({ dayWiseItinerary: updatedItinerary });
  };

  // Pre-populate with a few days if empty
  const initializeDays = () => {
    const initialDays: DayItem[] = [
      { day: 1, title: "", content: "", image: "" },
      { day: 2, title: "", content: "", image: "" },
      { day: 3, title: "", content: "", image: "" }
    ];
    onUpdate({ dayWiseItinerary: initialDays });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Day-wise Itinerary</h3>
          <p className="text-muted-foreground">
            Plan out each day of your trip with activities, locations, and images.
          </p>
        </div>
        <div className="flex gap-2">
          {data.dayWiseItinerary.length === 0 && (
            <Button 
              onClick={initializeDays}
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Initialize 3 Days
            </Button>
          )}
          <Button onClick={addDay}>
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </Button>
        </div>
      </div>

      {data.dayWiseItinerary.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h4 className="font-medium mb-2">No days planned yet</h4>
            <p className="text-sm mb-4">Start by adding your first day or initialize with a 3-day template</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={initializeDays} variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Initialize 3 Days
              </Button>
              <Button onClick={addDay}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Day
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.dayWiseItinerary.map((dayItem) => (
            <Card key={dayItem.day} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-background">
                      Day {dayItem.day}
                    </Badge>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(dayItem.day)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Section */}
                  <div className="space-y-2">
                    <ImageInput
                      label="Day Image"
                      value={dayItem.image}
                      onChange={(value) => updateDayImage(dayItem.day, value)}
                      keywords={`${dayItem.title || `day ${dayItem.day}`} activities sightseeing`}
                      placeholder={`Day ${dayItem.day} activities`}
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`day-${dayItem.day}-title`}>Day Title</Label>
                      <Input
                        id={`day-${dayItem.day}-title`}
                        placeholder={`e.g., Exploring Bangkok's Temples`}
                        value={dayItem.title}
                        onChange={(e) => updateDay(dayItem.day, "title", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`day-${dayItem.day}-content`}>Activities & Details</Label>
                      <Textarea
                        id={`day-${dayItem.day}-content`}
                        placeholder={`Describe the day's activities, timing, locations, and any special notes...

Example:
Morning: Visit Wat Pho Temple (9:00 AM)
Afternoon: Grand Palace tour (1:00 PM)
Evening: Dinner cruise on Chao Phraya River (7:00 PM)`}
                        value={dayItem.content}
                        onChange={(e) => updateDay(dayItem.day, "content", e.target.value)}
                        rows={8}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">📅 Day Planning Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Include specific times and locations for major activities</li>
          <li>• Add transportation details between locations</li>
          <li>• Consider meal times and restaurant recommendations</li>
          <li>• Include backup plans for weather-dependent activities</li>
          <li>• Add relevant images to make each day visually appealing</li>
        </ul>
      </div>
    </div>
  );
} 