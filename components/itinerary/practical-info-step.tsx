"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Clock } from "lucide-react";
import { ItineraryFormData } from "@/lib/types";

interface PracticalInfoStepProps {
  data: ItineraryFormData;
  onUpdate: (data: Partial<ItineraryFormData>) => void;
  form: UseFormReturn<ItineraryFormData>;
}

export function PracticalInfoStep({ data, onUpdate, form }: PracticalInfoStepProps) {
  const [newTip, setNewTip] = useState("");

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        [field]: value 
      } 
    });
  };

  const addTip = () => {
    if (newTip.trim()) {
      const existingTips = data.practicalInfo?.tips || [];
      if (!existingTips.includes(newTip.trim())) {
        const updatedTips = [...existingTips, newTip.trim()];
        onUpdate({ 
          practicalInfo: { 
            ...data.practicalInfo, 
            tips: updatedTips 
          } 
        });
        setNewTip("");
      }
    }
  };

  const removeTip = (tipToRemove: string) => {
    const updatedTips = (data.practicalInfo?.tips || []).filter(tip => tip !== tipToRemove);
    onUpdate({ 
      practicalInfo: { 
        ...data.practicalInfo, 
        tips: updatedTips 
      } 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTip();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Practical Information</h2>
        <p className="text-muted-foreground">
          Essential travel information for your trip
        </p>
      </div>

      {/* Visa Information */}
      <div className="space-y-2">
        <Label htmlFor="visa">Visa Requirements</Label>
        <Textarea
          id="visa"
          placeholder="e.g., Tourist visa required for stays over 30 days. Visa on arrival available for most countries."
          value={data.practicalInfo?.visa || ""}
          onChange={(e) => handleInputChange("visa", e.target.value)}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Describe visa requirements and entry regulations
        </p>
      </div>

      {/* Currency Information */}
      <div className="space-y-2">
        <Label htmlFor="currency">Currency & Money</Label>
        <Textarea
          id="currency"
          placeholder="e.g., Thai Baht (THB). Credit cards widely accepted. ATMs available in major cities."
          value={data.practicalInfo?.currency || ""}
          onChange={(e) => handleInputChange("currency", e.target.value)}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Currency, exchange rates, and payment methods
        </p>
      </div>

      {/* Travel Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a travel tip"
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              onKeyPress={handleKeyPress}
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
          
          {data.practicalInfo?.tips && data.practicalInfo.tips.length > 0 && (
            <div className="space-y-2">
              {data.practicalInfo.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex-1 text-sm text-amber-800">{tip}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTip(tip)}
                    className="h-6 w-6 p-0 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Add helpful tips for travelers (e.g., customs, etiquette, weather)
          </p>
        </CardContent>
      </Card>

      {/* Empty State */}
      {(!data.practicalInfo?.visa && !data.practicalInfo?.currency && (!data.practicalInfo?.tips || data.practicalInfo.tips.length === 0)) && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-8 pb-8 text-center">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practical information added yet</h3>
            <p className="text-gray-600 mb-4">
              Add visa requirements, currency info, and travel tips to help travelers prepare
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 