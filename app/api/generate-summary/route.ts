import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { routing, destination, highlights, dayWiseItinerary } = await request.json();

    // Validate required fields
    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required for summary generation" },
        { status: 400 }
      );
    }

    // Build the prompt with available data
    let prompt = `Summarize this travel itinerary into a short 2–3 sentence paragraph suitable for a PDF brochure. Do NOT repeat the destination or duration in your summary. Focus on the unique experiences, highlights, and what makes this trip special. Write in an engaging, travel brochure style.\n\n`;
    
    if (routing) {
      prompt += `Routing: ${routing}\n`;
    }
    
    if (highlights) {
      prompt += `Highlights: ${highlights}\n`;
    }
    
    if (dayWiseItinerary && dayWiseItinerary.length > 0) {
      prompt += `Itinerary:\n`;
      dayWiseItinerary.slice(0, 3).forEach((day: any) => {
        prompt += `Day ${day.day}: ${day.title} - ${day.content?.slice(0, 100) || 'Activities planned'}\n`;
      });
      if (dayWiseItinerary.length > 3) {
        prompt += `...and ${dayWiseItinerary.length - 3} more days\n`;
      }
    }

    // System message: Do NOT repeat destination or duration
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a travel writer specializing in creating compelling trip summaries for luxury travel brochures. Generate concise, engaging summaries that highlight the unique aspects of each journey. Do NOT repeat the destination or duration in your summary. Focus on the unique experiences, highlights, and what makes this trip special. Keep it to 2-3 sentences, travel-brochure style."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
} 