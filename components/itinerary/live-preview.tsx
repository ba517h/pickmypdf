import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Route, 
  Star, 
  Building2, 
  Camera, 
  FileText,
  Users,
  Heart,
  Compass
} from "lucide-react";
import { ItineraryFormData } from "@/lib/types";

interface LivePreviewProps {
  data: ItineraryFormData;
  currentStep: number;
}

export function LivePreview({ data, currentStep }: LivePreviewProps) {
  const hasBasicInfo = data.title || data.destination || data.duration;
  const hasHighlights = data.hotels.length > 0 || data.experiences.length > 0;
  const hasDayWise = data.dayWiseItinerary.length > 0;
  const hasOptional = data.withKids || data.withFamily || data.offbeatSuggestions;

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          Your itinerary summary will appear here as you fill the form
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step 1 Preview: Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentStep >= 1 ? "default" : "secondary"} className="text-xs">
              1
            </Badge>
            <h3 className="font-semibold text-sm">Overview</h3>
          </div>
          
          {hasBasicInfo ? (
            <div className="pl-6 space-y-2 text-sm">
              {data.title && (
                <div className="font-medium text-base text-foreground">
                  {data.title}
                </div>
              )}
              
              {data.destination && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {data.destination}
                </div>
              )}
              
              {data.duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {data.duration}
                </div>
              )}
              
              {data.routing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Route className="w-4 h-4" />
                  {data.routing}
                </div>
              )}
              
              {data.tripType && (
                <Badge variant="outline" className="text-xs">
                  {data.tripType}
                </Badge>
              )}
              
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="pl-6 text-sm text-muted-foreground">
              No overview data yet
            </div>
          )}
        </div>

        {/* Step 2 Preview: Highlights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentStep >= 2 ? "default" : "secondary"} className="text-xs">
              2
            </Badge>
            <h3 className="font-semibold text-sm">Highlights</h3>
          </div>
          
          {hasHighlights ? (
            <div className="pl-6 space-y-3 text-sm">
              {data.hotels.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">Hotels ({data.hotels.length})</span>
                  </div>
                  <div className="space-y-1">
                    {data.hotels.slice(0, 3).map((hotel, index) => (
                      <div key={index} className="text-muted-foreground pl-6">
                        • {hotel.name}
                      </div>
                    ))}
                    {data.hotels.length > 3 && (
                      <div className="text-muted-foreground pl-6">
                        ... and {data.hotels.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {data.experiences.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">Experiences ({data.experiences.length})</span>
                  </div>
                  <div className="space-y-1">
                    {data.experiences.slice(0, 3).map((experience, index) => (
                      <div key={index} className="text-muted-foreground pl-6">
                        • {experience.name}
                      </div>
                    ))}
                    {data.experiences.length > 3 && (
                      <div className="text-muted-foreground pl-6">
                        ... and {data.experiences.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {data.practicalInfo.visa && (
                <div className="text-muted-foreground">
                  <strong>Visa:</strong> {data.practicalInfo.visa}
                </div>
              )}
              
              {data.practicalInfo.currency && (
                <div className="text-muted-foreground">
                  <strong>Currency:</strong> {data.practicalInfo.currency}
                </div>
              )}
            </div>
          ) : (
            <div className="pl-6 text-sm text-muted-foreground">
              No highlights data yet
            </div>
          )}
        </div>

        {/* Step 3 Preview: Day-wise */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentStep >= 3 ? "default" : "secondary"} className="text-xs">
              3
            </Badge>
            <h3 className="font-semibold text-sm">Day-wise Itinerary</h3>
          </div>
          
          {hasDayWise ? (
            <div className="pl-6 space-y-2 text-sm">
              {data.dayWiseItinerary.slice(0, 3).map((day, index) => (
                <div key={index} className="text-muted-foreground">
                  <strong>Day {day.day}:</strong> {day.title}
                </div>
              ))}
              {data.dayWiseItinerary.length > 3 && (
                <div className="text-muted-foreground">
                  ... and {data.dayWiseItinerary.length - 3} more days
                </div>
              )}
            </div>
          ) : (
            <div className="pl-6 text-sm text-muted-foreground">
              No day-wise itinerary yet
            </div>
          )}
        </div>

        {/* Step 4 Preview: Optional */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={currentStep >= 4 ? "default" : "secondary"} className="text-xs">
              4
            </Badge>
            <h3 className="font-semibold text-sm">Optional Sections</h3>
          </div>
          
          {hasOptional ? (
            <div className="pl-6 space-y-2 text-sm">
              {data.withKids && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Family with Kids section added
                </div>
              )}
              
              {data.withFamily && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  Family-friendly section added
                </div>
              )}
              
              {data.offbeatSuggestions && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Compass className="w-4 h-4" />
                  Offbeat suggestions added
                </div>
              )}
            </div>
          ) : (
            <div className="pl-6 text-sm text-muted-foreground">
              No optional sections yet
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {data.dayWiseItinerary.length}
              </div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {data.hotels.length + data.experiences.length}
              </div>
              <div className="text-xs text-muted-foreground">Highlights</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 