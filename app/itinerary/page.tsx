"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, MapPin, Star, Calendar, Camera, Settings, Download, Archive, Plus, X } from "lucide-react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const draftId = searchParams.get('draftId');
  
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

  // Check for saved draft on component mount or load itinerary from draftId
  useEffect(() => {
    if (draftId) {
      // Load specific itinerary from URL parameter
      const loadItineraryFromUrl = async () => {
        const itinerary = await persistence.loadItinerary(draftId);
        if (itinerary) {
          setFormData(itinerary.form_data);
          setCurrentItineraryId(itinerary.id);
          setCurrentItineraryTitle(itinerary.title);
          setShowSmartInput(false);
          setActiveSection("overview");

          toast({
            title: "Itinerary Loaded",
            description: `"${itinerary.title}" has been loaded for editing.`,
          });
        } else {
          toast({
            title: "Load Failed",
            description: "Could not load the requested itinerary.",
            variant: "destructive",
          });
        }
      };
      
      loadItineraryFromUrl();
    } else {
      // Check for local draft only if no draftId in URL
      const draft = loadDraft();
      if (draft) {
        setDraftData(draft);
        setShowDraftPrompt(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]); // Removed persistence and toast from dependencies to prevent infinite loop

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
        return <OverviewStep data={formData} onUpdate={updateFormData} form={form} />;
      case "highlights":
        return <HighlightsStep data={formData} onUpdate={updateFormData} form={form} />;
      case "daywise":
        return <DayWiseStep data={formData} onUpdate={updateFormData} form={form} />;
      case "gallery":
        return <GalleryStep data={formData} onUpdate={updateFormData} form={form} />;
      case "optional":
        return <OptionalBlocksStep data={formData} onUpdate={updateFormData} form={form} />;
      default:
        return <OverviewStep data={formData} onUpdate={updateFormData} form={form} />;
    }
  };

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

  const closePage = () => {
    router.push('/dashboard');
  };

  if (showSmartInput) {
    return (
      <div className="min-h-screen bg-gray-50 font-manrope">
        <SmartInput onDataParsed={handleDataParsed} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Your Travel Itinerary</h1>
              <p className="text-gray-600 mt-1">Build a comprehensive travel itinerary that can be exported as a PDF</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <SaveStatusIndicator 
                status={persistence.saveStatus}
                lastSavedAt={persistence.lastSavedAt}
                onSave={handleSave}
              />
              
              <Button
                variant="outline"
                onClick={handleCreateNew}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
              
              <Button
                onClick={generatePDF}
                disabled={isGeneratingPdf || !formData.title || !formData.destination}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isGeneratingPdf ? (
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download PDF
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={closePage}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Notification */}
      {showDraftPrompt && draftData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Draft Found</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  We found a saved draft from {formatDraftTimestamp(draftData.timestamp)}. Would you like to continue where you left off?
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleContinueWithDraft}
                className="bg-yellow-800 hover:bg-yellow-900 text-white"
                size="sm"
              >
                Continue with Draft
              </Button>
              <Button
                onClick={handleDiscardDraft}
                variant="outline"
                size="sm"
              >
                Start Fresh
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar - Sections Navigation */}
        <div className="w-60 bg-white border-r border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Sections</h3>
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isCompleted = getSectionStatus(section.id);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{section.title}</span>
                    {isCompleted && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center - Form Components */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderActiveSection()}
          </div>
        </div>

        {/* Right - PDF Preview */}
        <div className="w-[460px] bg-gray-50 border-l border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">PDF Preview</h3>
              <div className="text-xs text-gray-500">TRAVEL ITINERARY</div>
            </div>
            <div className="bg-white rounded-lg border shadow-sm h-[600px] overflow-y-auto">
              <PdfPreview data={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 