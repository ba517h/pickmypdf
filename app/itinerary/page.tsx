"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

import { OverviewStep } from "@/components/itinerary/overview-step";
import { HighlightsStep } from "@/components/itinerary/highlights-step";
import { DayWiseStep } from "@/components/itinerary/day-wise-step";
import { OptionalBlocksStep } from "@/components/itinerary/optional-blocks-step";
import { SmartInput } from "@/components/smart-input";

export interface ItineraryFormData {
  // Step 1: Overview
  title: string;
  destination: string;
  duration: string;
  routing: string;
  tags: string[];
  tripType: string;

  // Step 2: Highlights
  hotels: string[];
  experiences: string[];
  practicalInfo: {
    visa: string;
    currency: string;
    tips: string[];
  };

  // Step 3: Day-wise Itinerary
  dayWiseItinerary: Array<{
    day: number;
    title: string;
    content: string;
  }>;

  // Step 4: Optional Blocks
  withKids: string;
  withFamily: string;
  offbeatSuggestions: string;
}

const steps = [
  { id: 1, title: "Overview", description: "Basic trip information" },
  { id: 2, title: "Highlights", description: "Hotels and experiences" },
  { id: 3, title: "Day-wise", description: "Daily itinerary" },
  { id: 4, title: "Optional", description: "Additional suggestions" }
];

export default function ItineraryCreatorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSmartInput, setShowSmartInput] = useState(true);
  const [formData, setFormData] = useState<ItineraryFormData>({
    title: "",
    destination: "",
    duration: "",
    routing: "",
    tags: [],
    tripType: "",
    hotels: [],
    experiences: [],
    practicalInfo: {
      visa: "",
      currency: "",
      tips: []
    },
    dayWiseItinerary: [],
    withKids: "",
    withFamily: "",
    offbeatSuggestions: ""
  });

  const form = useForm<ItineraryFormData>({
    defaultValues: formData
  });

  const updateFormData = (stepData: Partial<ItineraryFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleDataParsed = (data: ItineraryFormData) => {
    setFormData(data);
    setShowSmartInput(false);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const generatePDF = () => {
    console.log("Generating PDF with data:", formData);
    // TODO: Implement PDF generation
    alert("PDF generation will be implemented in the next phase!");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OverviewStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case 2:
        return (
          <HighlightsStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case 3:
        return (
          <DayWiseStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case 4:
        return (
          <OptionalBlocksStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create Your Travel Itinerary
        </h1>
        <p className="text-muted-foreground">
          Build a comprehensive travel itinerary that can be exported as a PDF
        </p>
      </div>

      {/* Smart Input Section */}
      {showSmartInput && (
        <div className="mb-8">
          <SmartInput onDataParsed={handleDataParsed} />
          <div className="flex items-center justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSmartInput(false)}
            >
              Skip and create manually
            </Button>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {!showSmartInput && (
        <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="mb-4" />
        
        {/* Step navigation */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex flex-col items-center text-sm transition-colors ${
                step.id === currentStep
                  ? "text-primary"
                  : step.id < currentStep
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2 transition-colors ${
                  step.id === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.id < currentStep
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-muted-foreground"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <span className="font-medium">{step.title}</span>
              <span className="text-xs opacity-75">{step.description}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Form content */}
      {!showSmartInput && (
        <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">{currentStep}</Badge>
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderCurrentStep()}</CardContent>
      </Card>
      )}

      {/* Navigation buttons */}
      {!showSmartInput && (
        <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === steps.length ? (
            <Button onClick={generatePDF} className="gap-2">
              <FileText className="w-4 h-4" />
              Generate PDF
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
      )}
    </div>
  );
} 