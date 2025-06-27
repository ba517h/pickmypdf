export const SYSTEM_PROMPT = `
You are a travel assistant. Extract the following text into a structured object that matches this TypeScript schema:

interface ItineraryFormData {
  title: string;
  destination: string;
  duration: string;
  routing: string;
  tags: string[];
  tripType: string;
  mainImage?: string;
  cityImages?: Array<{ city: string; image?: string; }>;
  hotels: Array<{ name: string; image?: string; }>;
  experiences: Array<{ name: string; image?: string; }>;
  practicalInfo: {
    visa: string;
    currency: string;
    tips: string[];
    otherInclusions?: Array<{
      name: string;
      description?: string;
      image?: string;
    }>;
  };
  dayWiseItinerary: Array<{
    day: number;
    title: string;
    content: string;
    image?: string;
  }>;
  withKids: string;
  withFamily: string;
  offbeatSuggestions: string;
  withKidsImage?: string;
  withFamilyImage?: string;
  offbeatImage?: string;
}

Use your best judgment to populate all fields from the input. Leave fields blank if information is missing. Don't hallucinate.

✅ Output only a compact JSON object matching the schema above.
✅ Do not include explanations, comments, or repeat the input content.
✅ Use short phrases instead of full sentences for arrays and descriptions.
✅ Minimize whitespace, avoid markdown or code blocks.
✅ For image fields, leave them empty as they will be handled by the UI.
✅ Convert simple string arrays (hotels, experiences) to object arrays with name property.

Respond only with the JSON object. No additional text.
`.trim();

/**
 * Generate a token-efficient prompt for OpenAI to extract itinerary data
 */
export function generateItineraryPrompt(content: string): string {
  return `Extract travel data from: ${content}`;
}

/**
 * Generate a validation prompt to check if extracted data makes sense
 */
export function generateValidationPrompt(extractedData: any): string {
  return `
Please validate this extracted travel itinerary data for completeness and accuracy.
Check if the data structure is logical and if key fields are properly filled:

${JSON.stringify(extractedData, null, 2)}

Return a JSON object with:
{
  "valid": boolean,
  "issues": ["array of any issues found"],
  "suggestions": ["array of improvement suggestions"]
}
`;
}

/**
 * Generate a refinement prompt to improve incomplete extractions
 */
export function generateRefinementPrompt(originalContent: string, extractedData: any): string {
  return `
The following travel content was partially extracted. Please improve the extraction by filling missing details and enhancing the structure:

Original content:
${originalContent}

Current extraction:
${JSON.stringify(extractedData, null, 2)}

Please return an improved version following the same schema, focusing on:
1. Filling empty required fields with reasonable defaults
2. Enhancing day-wise itinerary structure
3. Adding more practical information
4. Improving descriptions and details

Return ONLY the improved JSON object.
`;
} 