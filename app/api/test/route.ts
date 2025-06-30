import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Vercel-compatible Puppeteer setup with @sparticuz/chromium-min
async function launchBrowser() {
  if (process.env.NODE_ENV === 'development') {
    // Use regular Puppeteer for development
    const puppeteer = await import('puppeteer');
    return await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
  } else {
    // Use puppeteer-core with @sparticuz/chromium-min for production
    const puppeteerCore = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    // Performance optimizations for Vercel - Use default/correct API
    const executablePath = await chromium.default.executablePath();
    
    return await puppeteerCore.default.launch({
      args: [
        ...chromium.default.args,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-background-networking',
        '--memory-pressure-off',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--disable-notifications',
        '--disable-default-apps'
      ],
      executablePath,
      headless: true,
      timeout: 30000
    });
  }
}

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

export async function GET() {
  let browser;
  try {
    console.log('Testing Puppeteer setup...');
    
    browser = await launchBrowser();
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('Page created');
    
    await page.setContent('<html><body><h1>Test</h1></body></html>');
    console.log('Content set');
    
    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true 
    });
    console.log('PDF generated, size:', pdf.length);
    
    await browser.close();
    console.log('Browser closed successfully');
    
    return NextResponse.json({ 
      success: true, 
      pdfSize: pdf.length,
      message: 'Puppeteer working correctly'
    });
    
  } catch (error) {
    console.error('Puppeteer test error:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: errorStack,
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 });
  }
} 