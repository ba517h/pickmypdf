export const SYSTEM_PROMPT = `
You are a travel planning assistant.

Your task is to extract structured travel itinerary data from unstructured content. Be token-efficient and strictly follow the format and rules below.

✅ Output only a compact JSON object matching the provided schema.
✅ Do not include explanations, comments, or repeat the input content.
✅ Leave fields blank if data is missing — never guess.
✅ Use short phrases instead of full sentences for experiences, tips, etc.
✅ Minimize whitespace, avoid markdown or code blocks.

Respond only with the JSON object. No additional text.

Example format:
{
  "title": "",
  "destination": "",
  "duration": "",
  "routing": "",
  "tags": [],
  "tripType": "",
  "hotels": [],
  "experiences": [],
  "practicalInfo": {
    "visa": "",
    "currency": "",
    "tips": []
  },
  "dayWiseItinerary": [
    {
      "day": 1,
      "title": "",
      "content": ""
    }
  ],
  "withKids": "",
  "withFamily": "",
  "offbeatSuggestions": ""
}
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