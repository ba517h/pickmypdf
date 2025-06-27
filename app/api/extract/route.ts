import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ItineraryFormDataSchema } from "@/lib/schemas";
import { extractTextFromUrl } from "@/lib/extractors/url-extractor";
import { extractTextFromPdf } from "@/lib/extractors/pdf-extractor";
import { generateItineraryPrompt, SYSTEM_PROMPT } from "@/lib/prompts/itinerary-prompt";

// Initialize OpenAI with proper error handling
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Determine request type based on content type
    const contentType = request.headers.get("content-type");
    let extractedText: string = "";
    let inputSource: string = "";

    if (contentType?.includes("multipart/form-data")) {
      // Handle PDF upload
      const formData = await request.formData();
      const pdfFile = formData.get("pdf") as File;
      
      if (!pdfFile) {
        return NextResponse.json(
          { error: "PDF file is required" },
          { status: 400 }
        );
      }

      if (!pdfFile.type.includes("pdf")) {
        return NextResponse.json(
          { error: "File must be a PDF" },
          { status: 400 }
        );
      }

      extractedText = await extractTextFromPdf(pdfFile);
      inputSource = "PDF";
    } else {
      // Handle JSON requests (text or URL)
      const body = await request.json();

      if (body.text) {
        extractedText = body.text;
        inputSource = "Text";
      } else if (body.url) {
        if (!isValidUrl(body.url)) {
          return NextResponse.json(
            { error: "Invalid URL format" },
            { status: 400 }
          );
        }
        extractedText = await extractTextFromUrl(body.url);
        inputSource = "URL";
      } else {
        return NextResponse.json(
          { error: "Either 'text', 'url', or 'pdf' must be provided" },
          { status: 400 }
        );
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: `No extractable content found in ${inputSource.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Check if OpenAI is configured
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API is not configured. Please set OPENAI_API_KEY environment variable." },
        { status: 503 }
      );
    }

    // Generate the prompt for OpenAI
    const prompt = generateItineraryPrompt(extractedText);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse and validate the response
    let parsedData;
    try {
      parsedData = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", responseContent);
      throw new Error("Invalid JSON response from AI");
    }

    // Validate against schema
    const validatedData = ItineraryFormDataSchema.parse(parsedData);

    return NextResponse.json({
      data: validatedData,
    });

  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("Invalid JSON")) {
        return NextResponse.json(
          { error: "Failed to extract structured data from content" },
          { status: 422 }
        );
      }
      
      if (error.message.includes("OpenAI")) {
        return NextResponse.json(
          { error: "AI service temporarily unavailable" },
          { status: 503 }
        );
      }

      if (error.message.includes("validation")) {
        return NextResponse.json(
          { error: "Extracted data does not match expected format" },
          { status: 422 }
        );
      }

      if (error.message.includes("URL")) {
        return NextResponse.json(
          { error: "Failed to fetch content from URL" },
          { status: 400 }
        );
      }

      if (error.message.includes("PDF")) {
        return NextResponse.json(
          { error: "Failed to extract text from PDF" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
} 