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
import { ImageInput } from "@/components/ui/image-input";
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
  const [newInclusion, setNewInclusion] = useState("");
  const [newInclusionDesc, setNewInclusionDesc] = useState("");

  const addHotel = () => {
    if (newHotel.trim()) {
      const updatedHotels = [...data.hotels, { name: newHotel.trim(), image: "" }];
      onUpdate({ hotels: updatedHotels });
      setNewHotel("");
    }
  };

  const removeHotel = (indexToRemove: number) => {
    const updatedHotels = data.hotels.filter((_, index) => index !== indexToRemove);
    onUpdate({ hotels: updatedHotels });
  };

  const updateHotelImage = (index: number, imageUrl: string) => {
    const updatedHotels = data.hotels.map((hotel, i) =>
      i === index ? { ...hotel, image: imageUrl } : hotel
    );
    onUpdate({ hotels: updatedHotels });
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      const updatedExperiences = [...data.experiences, { name: newExperience.trim(), image: "" }];
      onUpdate({ experiences: updatedExperiences });
      setNewExperience("");
    }
  };

  const removeExperience = (indexToRemove: number) => {
    const updatedExperiences = data.experiences.filter((_, index) => index !== indexToRemove);
    onUpdate({ experiences: updatedExperiences });
  };

  const updateExperienceImage = (index: number, imageUrl: string) => {
    const updatedExperiences = data.experiences.map((experience, i) =>
      i === index ? { ...experience, image: imageUrl } : experience
    );
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

  const removeTip = (indexToRemove: number) => {
    const updatedTips = data.practicalInfo.tips.filter((_, index) => index !== indexToRemove);
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        tips: updatedTips 
      } 
    });
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      const existingInclusions = data.practicalInfo.otherInclusions || [];
      const updatedInclusions = [...existingInclusions, { 
        name: newInclusion.trim(), 
        description: newInclusionDesc.trim(),
        image: ""
      }];
      onUpdate({ 
        practicalInfo: { 
          ...data.practicalInfo, 
          otherInclusions: updatedInclusions 
        } 
      });
      setNewInclusion("");
      setNewInclusionDesc("");
    }
  };

  const removeInclusion = (indexToRemove: number) => {
    const updatedInclusions = (data.practicalInfo.otherInclusions || []).filter((_, index) => index !== indexToRemove);
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        otherInclusions: updatedInclusions 
      } 
    });
  };

  const updateInclusionImage = (index: number, imageUrl: string) => {
    const updatedInclusions = (data.practicalInfo.otherInclusions || []).map((inclusion, i) =>
      i === index ? { ...inclusion, image: imageUrl } : inclusion
    );
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        otherInclusions: updatedInclusions 
      } 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'hotel' | 'experience' | 'tip' | 'inclusion') => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (action) {
        case 'hotel': addHotel(); break;
        case 'experience': addExperience(); break;
        case 'tip': addTip(); break;
        case 'inclusion': addInclusion(); break;
      }
    }
  };

  const handlePracticalInfoChange = (field: 'visa' | 'currency', value: string) => {
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        [field]: value 
      } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Trip Highlights</h3>
        <p className="text-muted-foreground">
          Add key accommodations, experiences, and practical information to make your itinerary comprehensive.
        </p>
      </div>

      {/* Hotels & Accommodation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Hotels & Accommodation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a hotel"
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'hotel')}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.hotels.map((hotel, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {hotel.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHotel(index)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageInput
                      value={hotel.image}
                      onChange={(value) => updateHotelImage(index, value)}
                      keywords={`${hotel.name} hotel accommodation luxury`}
                      placeholder={`${hotel.name} hotel image`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            List your recommended accommodations with images
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Experiences & Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Must-Do Experiences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add an experience"
              value={newExperience}
              onChange={(e) => setNewExperience(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'experience')}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.experiences.map((experience, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {experience.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageInput
                      value={experience.image}
                      onChange={(value) => updateExperienceImage(index, value)}
                      keywords={`${experience.name} activity experience tour`}
                      placeholder={`${experience.name} experience image`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Highlight the key activities and experiences with images
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Practical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-green-500" />
            Practical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visa">Visa Requirements</Label>
              <Textarea
                id="visa"
                placeholder="Visa requirements, application process, documents needed..."
                value={data.practicalInfo.visa}
                onChange={(e) => handlePracticalInfoChange("visa", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency & Money</Label>
              <Textarea
                id="currency"
                placeholder="Local currency, exchange rates, payment methods, ATM availability..."
                value={data.practicalInfo.currency}
                onChange={(e) => handlePracticalInfoChange("currency", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Travel Tips */}
          <div className="space-y-2">
            <Label>Travel Tips</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a travel tip"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'tip')}
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
              <div className="flex flex-wrap gap-2 mt-2">
                {data.practicalInfo.tips.map((tip, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tip}
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Other Inclusions */}
          <div className="space-y-2">
            <Label>Other Inclusions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Inclusion name"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'inclusion')}
              />
              <Input
                placeholder="Description (optional)"
                value={newInclusionDesc}
                onChange={(e) => setNewInclusionDesc(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'inclusion')}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addInclusion}
              disabled={!newInclusion.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Inclusion
            </Button>
            
            {data.practicalInfo.otherInclusions && data.practicalInfo.otherInclusions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {data.practicalInfo.otherInclusions.map((inclusion, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {inclusion.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInclusion(index)}
                          className="h-6 w-6 p-0 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                      {inclusion.description && (
                        <p className="text-xs text-muted-foreground">{inclusion.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <ImageInput
                        value={inclusion.image}
                        onChange={(value) => updateInclusionImage(index, value)}
                        keywords={`${inclusion.name} service inclusion travel`}
                        placeholder={`${inclusion.name} image`}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 