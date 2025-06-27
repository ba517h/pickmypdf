"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileText, Clock } from "lucide-react";
import { loadDraft, clearDraft, formatDraftTimestamp } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

import { OverviewStep } from "@/components/itinerary/overview-step";
import { HighlightsStep } from "@/components/itinerary/highlights-step";
import { DayWiseStep } from "@/components/itinerary/day-wise-step";
import { GalleryStep } from "@/components/itinerary/gallery-step";
import { OptionalBlocksStep } from "@/components/itinerary/optional-blocks-step";
import { PdfPreview } from "@/components/itinerary/pdf-preview";
import { SmartInput } from "@/components/smart-input";

import { ItineraryFormData } from "@/lib/types";

const steps = [
  { id: 1, title: "Overview", description: "Basic trip information" },
  { id: 2, title: "Highlights", description: "Hotels and experiences" },
  { id: 3, title: "Day-wise", description: "Daily itinerary" },
  { id: 4, title: "Gallery", description: "Destination showcase" },
  { id: 5, title: "Optional", description: "Additional suggestions" }
];

export default function ItineraryCreatorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSmartInput, setShowSmartInput] = useState(true);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState<{ data: ItineraryFormData; timestamp: string } | null>(null);
  const [formData, setFormData] = useState<ItineraryFormData>({
    title: "",
    destination: "",
    duration: "",
    routing: "",
    tags: [],
    tripType: "",
    mainImage: "",
    cityImages: [],
    hotels: [],
    experiences: [],
    practicalInfo: {
      visa: "",
      currency: "",
      tips: [],
      otherInclusions: []
    },
    dayWiseItinerary: [],
    withKids: "",
    withFamily: "",
    offbeatSuggestions: ""
  });

  const form = useForm<ItineraryFormData>({
    defaultValues: formData
  });

  const { toast } = useToast();

  // Check for saved draft on component mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setDraftData(draft);
      setShowDraftPrompt(true);
    }
  }, []);

  const updateFormData = (stepData: Partial<ItineraryFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleDataParsed = (data: ItineraryFormData) => {
    setFormData(data);
    setShowSmartInput(false);
    setCurrentStep(1);
  };

  // Handle draft prompt actions
  const handleContinueWithDraft = () => {
    if (draftData) {
      setFormData(draftData.data);
      setShowSmartInput(false);
      setCurrentStep(1);
      setShowDraftPrompt(false);
      
      toast({
        title: "Draft Loaded",
        description: "Your previous itinerary draft has been loaded. You can continue editing.",
      });
    }
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setDraftData(null);
    setShowDraftPrompt(false);
    
    toast({
      title: "Draft Discarded",
      description: "Your previous draft has been cleared. Starting fresh.",
    });
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
          <GalleryStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case 5:
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create Your Travel Itinerary
        </h1>
        <p className="text-muted-foreground">
          Build a comprehensive travel itinerary that can be exported as a PDF
        </p>
      </div>

      {/* Draft Prompt */}
      {showDraftPrompt && draftData && (
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Clock className="w-5 h-5" />
              Draft Found
            </CardTitle>
            <CardDescription className="text-blue-700">
              We found a saved itinerary draft from {formatDraftTimestamp(draftData.timestamp)}. 
              Would you like to continue editing it or start fresh?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={handleContinueWithDraft} className="flex-1">
                Continue Editing Draft
              </Button>
              <Button 
                onClick={handleDiscardDraft} 
                variant="outline" 
                className="flex-1"
              >
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Input Section */}
      {showSmartInput && !showDraftPrompt && (
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

      {/* Two-Column Layout */}
      {!showSmartInput && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress indicator */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              {/* Step navigation */}
              <div className="grid grid-cols-5 gap-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`flex flex-col items-center text-sm transition-colors p-3 rounded-lg border ${
                      step.id === currentStep
                        ? "border-primary bg-primary/5 text-primary"
                        : step.id < currentStep
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-xs font-medium ${
                        step.id === currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.id < currentStep
                          ? "bg-green-600 text-white"
                          : "bg-muted-foreground/20"
                      }`}
                    >
                      {step.id < currentStep ? "✓" : step.id}
                    </div>
                    <span className="font-medium text-xs">{step.title}</span>
                    <span className="text-xs opacity-75">{step.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form content */}
            <Card>
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

            {/* Navigation buttons */}
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
          </div>

                     {/* Right Column - PDF Preview */}
           <div className="lg:col-span-1">
             <PdfPreview data={formData} />
           </div>
        </div>
      )}
    </div>
  );
} 