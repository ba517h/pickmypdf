"use client";

import { useState, useRef, ChangeEvent } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { FileText, Link, Type, Upload, RotateCcw } from "lucide-react";
import { ItineraryFormData } from "@/lib/types";
import { useExtractFormDataError } from "@/hooks/use-extract-form-data-error";
import { saveDraft } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";

interface SmartInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataParsed: (data: ItineraryFormData) => void;
  onConfirmOverride?: () => void; // For handling partial form override
  hasExistingData?: boolean; // Whether form already has data
}

type InputMode = "text" | "pdf" | "url";

export function SmartInputModal({ 
  open, 
  onOpenChange, 
  onDataParsed, 
  onConfirmOverride,
  hasExistingData = false 
}: SmartInputModalProps) {
  const [activeMode, setActiveMode] = useState<InputMode>("text");
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmOverride, setShowConfirmOverride] = useState(false);
  const [pendingData, setPendingData] = useState<ItineraryFormData | null>(null);
  
  // Store last used parameters for retry functionality
  const [lastMode, setLastMode] = useState<InputMode | null>(null);
  const [lastContent, setLastContent] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use custom error hook instead of local error state
  const { error, hasError, setError, clearError, logError } = useExtractFormDataError();
  
  // Toast for user feedback
  const { toast } = useToast();

  // API call to extract form data
  const extractFormData = async (mode: InputMode, content: string): Promise<ItineraryFormData> => {
    let requestBody: any;
    let headers: HeadersInit = {};

    if (mode === "text") {
      requestBody = JSON.stringify({ text: content });
      headers = { "Content-Type": "application/json" };
    } else if (mode === "url") {
      requestBody = JSON.stringify({ url: content });
      headers = { "Content-Type": "application/json" };
    } else if (mode === "pdf" && selectedFile) {
      requestBody = new FormData();
      requestBody.append("pdf", selectedFile);
      // Don't set Content-Type for FormData - browser will set it with boundary
    }

    const response = await fetch("/api/extract", {
      method: "POST",
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        clearError();
      } else {
        setError("Please select a PDF file");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    clearError();
    setIsLoading(true);

    let content = "";

    try {
      switch (activeMode) {
        case "text":
          if (!textContent.trim()) {
            throw new Error("Please enter some text content");
          }
          content = textContent.trim();
          break;
          
        case "pdf":
          if (!selectedFile) {
            throw new Error("Please select a PDF file");
          }
          content = `PDF file: ${selectedFile.name}`;
          break;
          
        case "url":
          if (!urlInput.trim()) {
            throw new Error("Please enter a URL");
          }
          // Validate URL format
          try {
            new URL(urlInput);
          } catch {
            throw new Error("Please enter a valid URL");
          }
          content = urlInput.trim();
          break;
      }

      // Store parameters for retry functionality
      setLastMode(activeMode);
      setLastContent(content);

      const extractedData = await extractFormData(activeMode, content);
      
      // Check if we need confirmation for override
      if (hasExistingData) {
        setPendingData(extractedData);
        setShowConfirmOverride(true);
        setIsLoading(false);
        return;
      }

      // Proceed with normal flow
      await processExtractedData(extractedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      logError("Extraction failed", { error: err, mode: activeMode, contentLength: content?.length });
    } finally {
      setIsLoading(false);
    }
  };

  const processExtractedData = async (extractedData: ItineraryFormData) => {
    // Auto-save draft after successful extraction
    saveDraft(extractedData);
    
    // Show success toast
    toast({
      title: "Itinerary Extracted Successfully",
      description: "AI-generated itinerary loaded. You can edit or refine it below.",
    });
    
    onDataParsed(extractedData);
    
    // Reset form and close modal
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTextContent("");
    setUrlInput("");
    setSelectedFile(null);
    setShowConfirmOverride(false);
    setPendingData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmOverride = async () => {
    if (pendingData) {
      await processExtractedData(pendingData);
    }
  };

  const handleCancelOverride = () => {
    setShowConfirmOverride(false);
    setPendingData(null);
    setIsLoading(false);
  };

  // Retry functionality
  const handleRetry = async () => {
    if (!lastMode || !lastContent) {
      setError("No previous attempt to retry");
      return;
    }

    clearError();
    setIsRetrying(true);

    try {
      const extractedData = await extractFormData(lastMode, lastContent);
      await processExtractedData(extractedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Retry failed. Please try again.";
      setError(errorMessage);
      logError("Retry failed", { error: err, mode: lastMode, contentLength: lastContent.length });
    } finally {
      setIsRetrying(false);
    }
  };

  const modes = [
    {
      id: "text" as InputMode,
      label: "Paste Text",
      icon: Type,
      description: "Paste raw text content"
    },
    {
      id: "pdf" as InputMode,
      label: "Upload PDF",
      icon: FileText,
      description: "Upload a PDF file"
    },
    {
      id: "url" as InputMode,
      label: "Enter URL",
      icon: Link,
      description: "Enter a URL to extract content"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Smart Input
          </DialogTitle>
          <DialogDescription>
            Extract itinerary data from text, PDF files, or URLs
          </DialogDescription>
        </DialogHeader>

        {/* Override Confirmation Dialog */}
        {showConfirmOverride && (
          <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-900">Override Existing Data?</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You have existing itinerary data. Proceeding will replace all current data with the extracted content.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleConfirmOverride}
                variant="default"
                size="sm"
              >
                Yes, Override
              </Button>
              <Button
                onClick={handleCancelOverride}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={activeMode === mode.id ? "default" : "outline"}
                  onClick={() => setActiveMode(mode.id)}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  disabled={isLoading || isRetrying || showConfirmOverride}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-center">
                    <div className="text-sm font-medium">{mode.label}</div>
                    <div className="text-xs opacity-75">{mode.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator />

          {/* Input Content */}
          <div className="space-y-4">
            {activeMode === "text" && (
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Content</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste your itinerary content here...

Example:
Day 1: Arrive in Bangkok
- Check into hotel in Sukhumvit
- Visit Chatuchak Market
- Dinner at street food market

Day 2: Temple Tour
- Wat Pho temple
- Grand Palace
- River cruise"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={8}
                  disabled={isLoading || isRetrying || showConfirmOverride}
                />
              </div>
            )}

            {activeMode === "pdf" && (
              <div className="space-y-2">
                <Label htmlFor="pdf-input">PDF File</Label>
                <div className="space-y-3">
                  <Input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    disabled={isLoading || isRetrying || showConfirmOverride}
                  />
                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{selectedFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMode === "url" && (
              <div className="space-y-2">
                <Label htmlFor="url-input">URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/itinerary"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading || isRetrying || showConfirmOverride}
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to extract itinerary content from a webpage
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {hasError && (
            <div className="space-y-3">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
              {/* Retry Button - Only show if we have previous attempt data */}
              {lastMode && lastContent && (
                <Button 
                  onClick={handleRetry} 
                  disabled={isRetrying || isLoading || showConfirmOverride}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <Icons.loaderCircle className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry Extraction
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || isRetrying || showConfirmOverride}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Icons.loaderCircle className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Extract Itinerary Data
              </>
            )}
          </Button>

          {isLoading && !showConfirmOverride && (
            <div className="text-center text-sm text-muted-foreground">
              Analyzing content and extracting itinerary data...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 