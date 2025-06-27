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
import { ItineraryFormData } from "@/app/itinerary/page";

interface DayWiseStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

interface DayItem {
  day: number;
  title: string;
  content: string;
}

export function DayWiseStep({ data, onUpdate }: DayWiseStepProps) {
  const addDay = () => {
    const newDay: DayItem = {
      day: data.dayWiseItinerary.length + 1,
      title: "",
      content: ""
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

  // Pre-populate with a few days if empty
  const initializeDays = () => {
    const initialDays: DayItem[] = [
      { day: 1, title: "", content: "" },
      { day: 2, title: "", content: "" },
      { day: 3, title: "", content: "" }
    ];
    onUpdate({ dayWiseItinerary: initialDays });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Itinerary
          </h3>
          <p className="text-sm text-muted-foreground">
            Create a day-by-day breakdown of your trip
          </p>
        </div>
        <div className="flex gap-2">
          {data.dayWiseItinerary.length === 0 && (
            <Button variant="outline" onClick={initializeDays}>
              <Plus className="w-4 h-4 mr-2" />
              Start with 3 days
            </Button>
          )}
          <Button onClick={addDay}>
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </Button>
        </div>
      </div>

      {data.dayWiseItinerary.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No days added yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your itinerary by adding your first day
            </p>
            <Button onClick={addDay}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Day
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.dayWiseItinerary.map((dayItem) => (
            <Card key={dayItem.day}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="default" className="px-3">
                      Day {dayItem.day}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {dayItem.title || "Untitled Day"}
                    </span>
                  </CardTitle>
                  {data.dayWiseItinerary.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(dayItem.day)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`day-${dayItem.day}-title`}>
                    Day Title
                  </Label>
                  <Input
                    id={`day-${dayItem.day}-title`}
                    placeholder="e.g., Arrival in Bangkok"
                    value={dayItem.title}
                    onChange={(e) => updateDay(dayItem.day, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`day-${dayItem.day}-content`}>
                    Activities & Details
                  </Label>
                  <Textarea
                    id={`day-${dayItem.day}-content`}
                    placeholder="Describe the day's activities, locations, timings, and any important notes...

Example:
• 09:00 - Arrive at Suvarnabhumi Airport
• 10:30 - Take Airport Rail Link to Phaya Thai Station
• 12:00 - Check into hotel in Sukhumvit area
• 14:00 - Lunch at Chatuchak Weekend Market
• 16:00 - Visit Jim Thompson House
• 19:00 - Dinner at Asiatique Night Market
• 21:00 - River cruise along Chao Phraya"
                    value={dayItem.content}
                    onChange={(e) => updateDay(dayItem.day, 'content', e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use bullet points, timings, and specific locations to create a detailed day plan
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data.dayWiseItinerary.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={addDay}>
            <Plus className="w-4 h-4 mr-2" />
            Add Another Day
          </Button>
        </div>
      )}
    </div>
  );
} 