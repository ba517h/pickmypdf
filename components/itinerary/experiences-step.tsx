"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Camera } from "lucide-react";
import { ImageInput } from "@/components/ui/image-input";
import { ItineraryFormData } from "@/lib/types";

interface ExperiencesStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function ExperiencesStep({ data, onUpdate, form }: ExperiencesStepProps) {
  const [newExperience, setNewExperience] = useState("");

  const addExperience = () => {
    if (newExperience.trim()) {
      const existingExperiences = data.experiences || [];
      if (!existingExperiences.some(exp => exp.name === newExperience.trim())) {
        const updatedExperiences = [...existingExperiences, { name: newExperience.trim(), image: "" }];
        onUpdate({ experiences: updatedExperiences });
        setNewExperience("");
      }
    }
  };

  const removeExperience = (nameToRemove: string) => {
    const updatedExperiences = (data.experiences || []).filter(exp => exp.name !== nameToRemove);
    onUpdate({ experiences: updatedExperiences });
  };

  const updateExperienceImage = (name: string, imageUrl: string) => {
    const updatedExperiences = (data.experiences || []).map(exp =>
      exp.name === name ? { ...exp, image: imageUrl } : exp
    );
    onUpdate({ experiences: updatedExperiences });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExperience();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Experiences & Activities</h2>
        <p className="text-muted-foreground">
          Add memorable experiences and activities for your trip
        </p>
      </div>

      {/* Add new experience */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="w-4 h-4" />
            Add Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Snorkeling in Phi Phi Islands, Temple Tour, Cooking Class"
              value={newExperience}
              onChange={(e) => setNewExperience(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addExperience} disabled={!newExperience.trim()} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Experiences list */}
      {data.experiences && data.experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Experiences ({data.experiences.length})</h3>
          
          <div className="space-y-3">
            {data.experiences.map((experience, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    {/* Image Section */}
                    <div className="w-28 flex-shrink-0">
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">Image</Label>
                      <ImageInput
                        value={experience.image}
                        onChange={(imageUrl) => updateExperienceImage(experience.name, imageUrl)}
                        keywords={`${experience.name} ${data.destination || ''} activity experience adventure`}
                        placeholder={`${experience.name}`}
                        className="w-full"
                        compact={true}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-base text-gray-900 mb-1">{experience.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">Unforgettable experience awaits</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Activity</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Popular</span>
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(experience.name)}
                          className="h-8 w-8 p-0 hover:text-destructive ml-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!data.experiences || data.experiences.length === 0) && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-8 pb-8 text-center">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences added yet</h3>
            <p className="text-gray-600 mb-4">
              Add activities and experiences to make your trip memorable
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 