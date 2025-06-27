import { z } from "zod";

// Schema for practical information
const PracticalInfoSchema = z.object({
  visa: z.string(),
  currency: z.string(),
  tips: z.array(z.string()),
});

// Schema for day-wise itinerary items
const DayWiseItemSchema = z.object({
  day: z.number(),
  title: z.string(),
  content: z.string(),
});

// Main ItineraryFormData schema
export const ItineraryFormDataSchema = z.object({
  // Step 1: Overview
  title: z.string(),
  destination: z.string(),
  duration: z.string(),
  routing: z.string(),
  tags: z.array(z.string()),
  tripType: z.string(),

  // Step 2: Highlights
  hotels: z.array(z.string()),
  experiences: z.array(z.string()),
  practicalInfo: PracticalInfoSchema,

  // Step 3: Day-wise Itinerary
  dayWiseItinerary: z.array(DayWiseItemSchema),

  // Step 4: Optional Blocks
  withKids: z.string(),
  withFamily: z.string(),
  offbeatSuggestions: z.string(),
});

// Request schemas for different input types
export const TextRequestSchema = z.object({
  text: z.string().min(1, "Text content cannot be empty"),
});

export const UrlRequestSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

export const PdfRequestSchema = z.object({
  pdf: z.any(), // Will be validated as FormData in the handler
});

// Combined request schema
export const ExtractRequestSchema = z.union([
  TextRequestSchema,
  UrlRequestSchema,
  PdfRequestSchema,
]);

// Response schema
export const ExtractResponseSchema = z.object({
  data: ItineraryFormDataSchema,
});

// Type exports
export type ItineraryFormData = z.infer<typeof ItineraryFormDataSchema>;
export type TextRequest = z.infer<typeof TextRequestSchema>;
export type UrlRequest = z.infer<typeof UrlRequestSchema>;
export type PdfRequest = z.infer<typeof PdfRequestSchema>;
export type ExtractRequest = z.infer<typeof ExtractRequestSchema>;
export type ExtractResponse = z.infer<typeof ExtractResponseSchema>; 