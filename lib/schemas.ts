import { z } from "zod";

// Schema for city images
const CityImageSchema = z.object({
  city: z.string(),
  image: z.string().optional(),
});

// Schema for other inclusions with images
const InclusionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

// Schema for practical information
const PracticalInfoSchema = z.object({
  visa: z.string(),
  currency: z.string(),
  tips: z.array(z.string()),
  otherInclusions: z.array(InclusionSchema).optional(),
});

// Schema for hotels with images, rating, and reviews
const HotelSchema = z.object({
  name: z.string(),
  city: z.string().optional(),
  nights: z.number().min(1).max(30).optional(),
  image: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  phrases: z.array(z.string()).optional(),
  fetchedFromAPI: z.boolean().optional(),
});

// Schema for experiences with images
const ExperienceSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
});

// Schema for day-wise itinerary items with images
const DayWiseItemSchema = z.object({
  day: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().optional(),
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
  
  // Main itinerary image
  mainImage: z.string().optional(),
  
  // City-level images
  cityImages: z.array(CityImageSchema).optional(),

  // Step 2: Highlights
  hotels: z.array(HotelSchema),
  experiences: z.array(ExperienceSchema),
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

// Schemas for itinerary persistence
export const CreateItinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  form_data: ItineraryFormDataSchema,
});

export const UpdateItinerarySchema = z.object({
  id: z.string().uuid("Invalid itinerary ID"),
  title: z.string().min(1, "Title is required").optional(),
  form_data: ItineraryFormDataSchema.optional(),
});

export const ItineraryResponseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  form_data: ItineraryFormDataSchema,
  created_at: z.string(),
  updated_at: z.string(),
  last_exported_at: z.string().nullable(),
});

export const ItinerariesListResponseSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    last_exported_at: z.string().nullable(),
  })
);

// Type exports for persistence
export type CreateItineraryRequest = z.infer<typeof CreateItinerarySchema>;
export type UpdateItineraryRequest = z.infer<typeof UpdateItinerarySchema>;
export type ItineraryResponse = z.infer<typeof ItineraryResponseSchema>;
export type ItinerariesListResponse = z.infer<typeof ItinerariesListResponseSchema>; 