import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageInput } from "@/components/ui/image-input";
import { X, Plus, MapPin, Camera } from "lucide-react";
import { ItineraryFormData } from "@/lib/types";

interface GalleryStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function GalleryStep({ data, onUpdate, form }: GalleryStepProps) {
  const [newGalleryItem, setNewGalleryItem] = useState("");

  const addGalleryItem = () => {
    if (newGalleryItem.trim()) {
      const existingGallery = data.destinationGallery || [];
      if (!existingGallery.some(item => item.name === newGalleryItem.trim())) {
        const updatedGallery = [...existingGallery, { 
          name: newGalleryItem.trim(), 
          image: "",
          type: "activity" as const // default type
        }];
        onUpdate({ destinationGallery: updatedGallery });
        setNewGalleryItem("");
      }
    }
  };

  const removeGalleryItem = (nameToRemove: string) => {
    const updatedGallery = (data.destinationGallery || []).filter(item => item.name !== nameToRemove);
    onUpdate({ destinationGallery: updatedGallery });
  };

  const updateGalleryImage = (name: string, imageUrl: string) => {
    const updatedGallery = (data.destinationGallery || []).map(item =>
      item.name === name ? { ...item, image: imageUrl } : item
    );
    onUpdate({ destinationGallery: updatedGallery });
  };

  const updateGalleryType = (name: string, type: "city" | "activity" | "landmark") => {
    const updatedGallery = (data.destinationGallery || []).map(item =>
      item.name === name ? { ...item, type } : item
    );
    onUpdate({ destinationGallery: updatedGallery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGalleryItem();
    }
  };

  // Auto-populate with some default suggestions based on destination
  const addDefaultSuggestions = () => {
    const defaultItems = [
      { name: `${data.destination} Skyline`, type: "city" as const },
      { name: `Local Markets`, type: "activity" as const },
      { name: `Historic Landmarks`, type: "landmark" as const },
      { name: `Cultural Activities`, type: "activity" as const }
    ];

    const existingGallery = data.destinationGallery || [];
    const newItems = defaultItems.filter(item => 
      !existingGallery.some(existing => existing.name === item.name)
    );

    if (newItems.length > 0) {
      const updatedGallery = [...existingGallery, ...newItems.map(item => ({
        name: item.name,
        image: "",
        type: item.type
      }))];
      onUpdate({ destinationGallery: updatedGallery });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Destination Gallery</h2>
        <p className="text-muted-foreground">
          Add beautiful images to showcase your destination's highlights, activities, and landmarks.
        </p>
      </div>

      {/* Quick suggestions */}
      {data.destination && (!data.destinationGallery || data.destinationGallery.length === 0) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Quick Start</h3>
                <p className="text-sm text-blue-700">Add some popular gallery items for {data.destination}</p>
              </div>
              <Button onClick={addDefaultSuggestions} size="sm" variant="outline">
                Add Suggestions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add new gallery item */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="w-4 h-4" />
            Add Gallery Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Oslo Harbor, Northern Lights, Traditional Church"
              value={newGalleryItem}
              onChange={(e) => setNewGalleryItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addGalleryItem} disabled={!newGalleryItem.trim()} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gallery items */}
      {data.destinationGallery && data.destinationGallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Gallery Items ({data.destinationGallery.length})</h3>
          
          <div className="space-y-3">
            {data.destinationGallery.map((item, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    {/* Image Section */}
                    <div className="w-28 flex-shrink-0">
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">Image</Label>
                      <ImageInput
                        value={item.image}
                        onChange={(imageUrl) => updateGalleryImage(item.name, imageUrl)}
                        keywords={`${item.name} ${data.destination || ''} ${item.type}`}
                        placeholder={`${item.name}`}
                        className="w-full"
                        compact={true}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      {/* Header with name and remove button */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {["city", "activity", "landmark"].map((type) => (
                              <button
                                key={type}
                                onClick={() => updateGalleryType(item.name, type as any)}
                                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                  item.type === type
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGalleryItem(item.name)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0 ml-2 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
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

      {/* Empty state */}
      {(!data.destinationGallery || data.destinationGallery.length === 0) && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-8 pb-8 text-center">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items yet</h3>
            <p className="text-gray-600 mb-4">
              Add cities, landmarks, and activities to create a beautiful destination gallery
            </p>
            {data.destination && (
              <Button onClick={addDefaultSuggestions} variant="outline" size="sm">
                Get Started with Suggestions
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 