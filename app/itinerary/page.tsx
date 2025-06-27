"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, MapPin, Star, Calendar, Camera, Settings } from "lucide-react";
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

const sections = [
  { 
    id: "overview", 
    title: "Overview", 
    description: "Basic trip information",
    icon: FileText,
    step: 1
  },
  { 
    id: "highlights", 
    title: "Highlights", 
    description: "Hotels and experiences",
    icon: Star,
    step: 2
  },
  { 
    id: "daywise", 
    title: "Day-wise", 
    description: "Daily itinerary",
    icon: Calendar,
    step: 3
  },
  { 
    id: "gallery", 
    title: "Gallery", 
    description: "Destination showcase",
    icon: Camera,
    step: 4
  },
  { 
    id: "optional", 
    title: "Optional", 
    description: "Additional suggestions",
    icon: Settings,
    step: 5
  }
];

export default function ItineraryCreatorPage() {
  const [activeSection, setActiveSection] = useState("overview");
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
    setActiveSection("overview");
  };

  // Handle draft prompt actions
  const handleContinueWithDraft = () => {
    if (draftData) {
      setFormData(draftData.data);
      setShowSmartInput(false);
      setActiveSection("overview");
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

  const generatePDF = () => {
    console.log("Generating PDF with data:", formData);
    // TODO: Implement PDF generation
    alert("PDF generation will be implemented in the next phase!");
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case "highlights":
        return (
          <HighlightsStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case "daywise":
        return (
          <DayWiseStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case "gallery":
        return (
          <GalleryStep
            data={formData}
            onUpdate={updateFormData}
            form={form}
          />
        );
      case "optional":
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

  // Calculate completion status for each section
  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case "overview":
        return formData.title && formData.destination && formData.duration;
      case "highlights":
        return formData.hotels.length > 0 || formData.experiences.length > 0;
      case "daywise":
        return formData.dayWiseItinerary.length > 0;
      case "gallery":
        return formData.destinationGallery && formData.destinationGallery.length > 0;
      case "optional":
        return formData.withKids || formData.withFamily || formData.offbeatSuggestions;
      default:
        return false;
    }
  };

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight">Create Your Travel Itinerary</h1>
          <p className="text-muted-foreground text-sm">
            Build a comprehensive travel itinerary that can be exported as a PDF
          </p>
        </div>

        {/* Draft prompt modal */}
        {showDraftPrompt && draftData && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <Clock className="w-4 h-4" />
                  Draft Found
                </div>
                <p className="text-amber-700 text-sm mt-1">
                  We found a saved draft from {formatDraftTimestamp(draftData.timestamp)}. 
                  Would you like to continue where you left off?
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleContinueWithDraft} variant="default" size="sm">
                  Continue with Draft
                </Button>
                <Button onClick={handleDiscardDraft} variant="outline" size="sm">
                  Start Fresh
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Input for initial setup */}
        {showSmartInput && (
          <div className="bg-white border-b px-6 py-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Quick Start</h2>
              <p className="text-muted-foreground text-sm">
                Paste your existing itinerary or trip details to get started quickly
              </p>
            </div>
            <SmartInput onDataParsed={handleDataParsed} />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowSmartInput(false)}
              >
                Skip and create manually
              </Button>
            </div>
          </div>
        )}

        {/* Three Column Layout */}
        {!showSmartInput && (
          <div className="grid grid-cols-12 h-full">
            {/* Column 1: Navigation Sidebar */}
            <div className="col-span-2 bg-white border-r">
              <div className="sticky top-0 p-4">
                <h3 className="font-semibold text-sm mb-3 text-gray-700">Sections</h3>
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const isCompleted = getSectionStatus(section.id);
                    
                    return (
                                             <button
                         key={section.id}
                         onClick={() => setActiveSection(section.id)}
                         className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${
                           isActive
                             ? "border-primary bg-primary/5 text-primary"
                             : isCompleted
                             ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                             : "border-muted bg-background hover:bg-muted/50"
                         }`}
                       >
                         <div
                           className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                             isActive
                               ? "bg-primary text-primary-foreground"
                               : isCompleted
                               ? "bg-green-600 text-white"
                               : "bg-muted-foreground/20"
                           }`}
                         >
                           {isCompleted ? "✓" : <Icon className="w-3 h-3" />}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="font-medium text-sm">{section.title}</div>
                           <div className="text-xs opacity-75 truncate">{section.description}</div>
                         </div>
                       </button>
                    );
                  })}
                  
                                     {/* Generate PDF Button */}
                   <div className="pt-4 mt-4 border-t">
                     <Button 
                       onClick={generatePDF} 
                       className="w-full"
                       disabled={!formData.title || !formData.destination}
                     >
                       <FileText className="w-4 h-4 mr-2" />
                       Generate PDF
                     </Button>
                   </div>
                 </div>
               </div>
             </div>

            {/* Column 2: Form Content */}
            <div className="col-span-6 bg-white">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{currentSection?.step}</Badge>
                    <h2 className="text-xl font-semibold">{currentSection?.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {currentSection?.description}
                  </p>
                </div>
                {renderActiveSection()}
              </div>
            </div>

            {/* Column 3: Live Preview */}
            <div className="col-span-4 bg-gray-50">
              <div className="sticky top-0 p-4">
                <PdfPreview data={formData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 