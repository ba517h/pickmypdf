"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, MapPin, Star, Calendar, Camera, Settings, Download, Archive, Plus } from "lucide-react";
import { loadDraft, clearDraft, formatDraftTimestamp } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

import { OverviewStep } from "@/components/itinerary/overview-step";
import { HighlightsStep } from "@/components/itinerary/highlights-step";
import { DayWiseStep } from "@/components/itinerary/day-wise-step";
import { GalleryStep } from "@/components/itinerary/gallery-step";
import { OptionalBlocksStep } from "@/components/itinerary/optional-blocks-step";
import { PdfPreview } from "@/components/itinerary/pdf-preview";
import { SmartInput } from "@/components/smart-input";
import { SaveStatusIndicator } from "@/components/ui/save-status-indicator";
import { SavedItinerariesList } from "@/components/itinerary/saved-itineraries-list";

import { ItineraryFormData } from "@/lib/types";
import { useItineraryPersistence } from "@/hooks/use-itinerary-persistence";
import { ItineraryResponse } from "@/lib/schemas";

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
  const [showSavedItineraries, setShowSavedItineraries] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState<{ data: ItineraryFormData; timestamp: string } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [currentItineraryId, setCurrentItineraryId] = useState<string | null>(null);
  const [currentItineraryTitle, setCurrentItineraryTitle] = useState<string>("");
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

  // Initialize persistence hook
  const persistence = useItineraryPersistence({
    formData,
    currentItineraryId,
    autoSaveDelay: 3000, // 3 seconds
  });

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

  // Handle loading a saved itinerary
  const handleLoadItinerary = async (id: string) => {
    const itinerary = await persistence.loadItinerary(id);
    if (itinerary) {
      setFormData(itinerary.form_data);
      setCurrentItineraryId(itinerary.id);
      setCurrentItineraryTitle(itinerary.title);
      setShowSavedItineraries(false);
      setShowSmartInput(false);
      setActiveSection("overview");

      toast({
        title: "Itinerary Loaded",
        description: `"${itinerary.title}" has been loaded for editing.`,
      });
    }
  };

  // Handle creating new itinerary
  const handleCreateNew = () => {
    setFormData({
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
    setCurrentItineraryId(null);
    setCurrentItineraryTitle("");
    setShowSavedItineraries(false);
    setShowSmartInput(true);
  };

  // Handle manual save
  const handleSave = async () => {
    const title = formData.title || currentItineraryTitle || 'Untitled Itinerary';
    const result = await persistence.saveManually(title);
    
    if (result && !currentItineraryId) {
      // This was a new itinerary, update our state
      setCurrentItineraryId(result.id);
      setCurrentItineraryTitle(result.title);
    }
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Validate required fields
      if (!formData.title || !formData.destination) {
        toast({
          title: "Missing Information",
          description: "Please provide at least a title and destination before generating PDF.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.title || 'itinerary'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mark as exported if this is a saved itinerary
      if (currentItineraryId) {
        await persistence.markAsExported(currentItineraryId);
      }

      toast({
        title: "PDF Generated Successfully",
        description: "Your travel itinerary has been downloaded as a PDF.",
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {currentItineraryTitle || formData.title || "Create Your Travel Itinerary"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {currentItineraryId ? "Editing saved itinerary" : "Build a comprehensive travel itinerary that can be exported as a PDF"}
                </p>
              </div>
              
              {/* Save Status Indicator */}
              {!showSmartInput && !showSavedItineraries && (
                <SaveStatusIndicator
                  status={persistence.saveStatus}
                  lastSavedAt={persistence.lastSavedAt}
                  onSave={handleSave}
                  className="ml-4"
                />
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Navigation Buttons */}
              <Button 
                onClick={() => setShowSavedItineraries(!showSavedItineraries)}
                variant="ghost"
                size="sm"
              >
                <Archive className="w-4 h-4 mr-2" />
                {showSavedItineraries ? "Hide" : "Saved"}
              </Button>
              
              <Button 
                onClick={handleCreateNew}
                variant="ghost"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
              
              <Button 
                onClick={generatePDF} 
                variant="outline"
                disabled={!formData.title || !formData.destination || isGeneratingPdf}
                className="hidden md:flex"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
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

        {/* Saved Itineraries List */}
        {showSavedItineraries && (
          <div className="bg-white border-b px-6 py-6">
            <SavedItinerariesList
              onLoadItinerary={handleLoadItinerary}
              onDeleteItinerary={persistence.deleteItinerary}
            />
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
                      disabled={!formData.title || !formData.destination || isGeneratingPdf}
                    >
                      {isGeneratingPdf ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-foreground" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </>
                      )}
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