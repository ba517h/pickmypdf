"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageInputProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  keywords?: string;
  className?: string;
  label?: string;
}

export function ImageInput({ 
  value, 
  onChange, 
  placeholder = "Select an image", 
  keywords = "travel",
  className,
  label
}: ImageInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageKey, setImageKey] = useState(0); // For forcing image refresh
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate Unsplash URL with keywords
  const getUnsplashUrl = (searchKeywords: string, forceRefresh: boolean = false) => {
    const query = encodeURIComponent(searchKeywords);
    const timestamp = forceRefresh ? `&${Date.now()}` : '';
    return `https://source.unsplash.com/800x600/?${query}${timestamp}`;
  };

  // Use user image if available, otherwise use Unsplash placeholder
  const currentImageUrl = value || getUnsplashUrl(keywords, imageKey > 0);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsLoading(true);
    
    // Create a local URL for the uploaded file
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const refreshPlaceholder = () => {
    setImageKey(prev => prev + 1);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label>{label}</Label>}
      
      {/* Image Preview */}
      <Card 
        className={cn(
          "relative overflow-hidden border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary/50 cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="aspect-video relative">
          {currentImageUrl ? (
            <>
              <img
                src={currentImageUrl}
                alt={placeholder}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {value && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {!value && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshPlaceholder();
                  }}
                  title="Get new image"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="bg-white/90 p-2 rounded-lg text-sm font-medium text-gray-900">
                  Click to change image
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-8 w-8 mb-2" />
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs">Drag & drop or click to select</p>
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-sm">Loading...</div>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload button */}
      <Button 
        type="button" 
        variant="outline" 
        onClick={openFileDialog}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {value ? "Change Image" : "Upload Image"}
      </Button>

      {!value && (
        <p className="text-xs text-muted-foreground text-center">
          Using Unsplash image for keywords: &quot;{keywords}&quot;
        </p>
      )}
    </div>
  );
} 