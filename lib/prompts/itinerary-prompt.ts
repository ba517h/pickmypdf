/**
 * Generate a comprehensive prompt for OpenAI to extract itinerary data
 * This prompt is designed to work with GPT-4 and ensures consistent output format
 */
export function generateItineraryPrompt(content: string): string {
  return `
Extract travel itinerary information from the following content and return it as a JSON object matching this exact schema:

{
  "title": "string - A compelling trip title",
  "destination": "string - Countries, cities, or regions",
  "duration": "string - Trip length (e.g., '7 days', '2 weeks')",
  "routing": "string - Travel route description",
  "tags": ["array of strings - descriptive tags"],
  "tripType": "string - One of: Adventure, Relaxation, Cultural, Business, Family, Romantic, Solo Travel, Group Travel, Backpacking, Luxury",
  
  "hotels": ["array of strings - hotel/accommodation names"],
  "experiences": ["array of strings - key activities and experiences"],
  "practicalInfo": {
    "visa": "string - visa requirements and entry information",
    "currency": "string - currency info and budget guidance",
    "tips": ["array of strings - practical travel tips"]
  },
  
  "dayWiseItinerary": [
    {
      "day": number,
      "title": "string - day title",
      "content": "string - detailed daily activities with times if available"
    }
  ],
  
  "withKids": "string - family travel recommendations",
  "withFamily": "string - multi-generational travel advice", 
  "offbeatSuggestions": "string - unique/alternative recommendations"
}

EXTRACTION GUIDELINES:

1. **Title**: Create a compelling, descriptive title if not explicitly provided
2. **Destination**: Extract all mentioned locations, countries, cities
3. **Duration**: Parse any time references (days, weeks, months)
4. **Routing**: Describe the travel path/sequence if mentioned
5. **Tags**: Add relevant keywords (budget, luxury, adventure, etc.)
6. **Trip Type**: Choose the most appropriate category from the list
7. **Hotels**: Extract accommodation names, avoid generic descriptions
8. **Experiences**: List specific activities, tours, attractions
9. **Practical Info**: 
   - Visa: Any entry requirements mentioned
   - Currency: Local currency and budget information
   - Tips: Practical advice (what to pack, customs, etc.)
10. **Day-wise**: Structure chronological activities by day
11. **Family sections**: Extract any family-specific advice
12. **Offbeat**: Alternative or unique suggestions

IMPORTANT RULES:
- Return ONLY valid JSON, no additional text
- Use empty strings "" for missing string fields
- Use empty arrays [] for missing array fields
- Ensure all required fields are present
- If no day-wise information is available, create a reasonable structure based on activities mentioned
- Keep descriptions concise but informative
- Preserve specific names, places, and details mentioned in the source

Content to extract from:
${content}
`;
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