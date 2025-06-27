import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const text = body.text || "Hello world";

    console.log("Testing OpenAI with text:", text);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Just respond with: {"test": "success", "input": "${text}"}`
        }
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    return NextResponse.json({
      success: true,
      openai_response: responseContent,
      input: text
    });

  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : null
      },
      { status: 500 }
    );
  }
} 