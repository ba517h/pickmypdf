import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { ItineraryFormData } from '@/lib/types';
import { PdfMobileTemplate } from '@/components/itinerary/pdf-mobile-template';
import { getImageUrl } from '@/lib/bing-image-api';
import { PreviewImages } from '@/hooks/use-preview-images';

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
    // Simplified production configuration for maximum speed
    const puppeteerCore = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium-min');
    
    // Remote URL for brotli files - cached after first download
    const REMOTE_PACK_URL = 'https://github.com/Sparticuz/chromium/releases/download/v137.0.1/chromium-v137.0.1-pack.x64.tar';
    const executablePath = await chromium.default.executablePath(REMOTE_PACK_URL);
    
    return await puppeteerCore.default.launch({
      args: [
        ...chromium.default.args,
        '--disable-web-security',
        '--disable-dev-shm-usage'
      ],
      executablePath,
      headless: true,
      timeout: 15000  // Reduced timeout
    });
  }
}

// Export function configuration for Vercel
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const { formData, previewImages }: { 
      formData: ItineraryFormData; 
      previewImages?: PreviewImages;
    } = await request.json();
    
    console.log('Starting PDF generation for:', formData.title);
    console.log('FormData structure:', JSON.stringify({
      title: formData.title,
      hasHotels: !!formData.hotels,
      hotelsLength: formData.hotels?.length,
      hasExperiences: !!formData.experiences,
      experiencesLength: formData.experiences?.length,
      hasDayWise: !!formData.dayWiseItinerary,
      dayWiseLength: formData.dayWiseItinerary?.length,
      hasPracticalInfo: !!formData.practicalInfo,
      hasTips: !!formData.practicalInfo?.tips,
      tipsLength: formData.practicalInfo?.tips?.length
    }));

    // Ensure formData has proper structure with defaults
    const safeFormData: ItineraryFormData = {
      ...formData,
      hotels: formData.hotels || [],
      experiences: formData.experiences || [],
      dayWiseItinerary: formData.dayWiseItinerary || [],
      tags: formData.tags || [],
      practicalInfo: {
        visa: formData.practicalInfo?.visa || '',
        currency: formData.practicalInfo?.currency || '',
        tips: formData.practicalInfo?.tips || []
      },
      destinationGallery: formData.destinationGallery || [],
      cityImages: formData.cityImages || []
    };
    
    console.log('Safe form data created');
    
    // Use provided preview images or generate fast placeholders if none provided
    console.log('Using preview images...');
    const finalPreviewImages = previewImages || await loadPreviewImagesDirect(safeFormData);
    console.log('Preview images ready');
    
    // Render the actual React component to HTML using dynamic import
    console.log('Importing React DOM server...');
    const { renderToString } = await import('react-dom/server');
    console.log('Rendering React component...');
    const componentHtml = renderToString(
      React.createElement(PdfMobileTemplate, {
        data: safeFormData,
        previewImages: finalPreviewImages
      })
    );
    console.log('React component rendered, HTML length:', componentHtml.length);
    
    // Generate complete HTML document
    console.log('Generating HTML document...');
    const htmlContent = generateHtmlDocument(componentHtml, safeFormData);
    console.log('HTML document generated');
    
    // Launch browser with Vercel-compatible setup
    console.log('Launching browser...');
    browser = await launchBrowser();
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('Page created');

    // Fast viewport setup
    await page.setViewport({ width: 420, height: 800, deviceScaleFactor: 1 });
    
    // Fast content loading without expensive wait conditions
    console.log('Setting HTML content for fast PDF generation...');
    await page.setContent(htmlContent, { 
      waitUntil: 'load',  // Faster than domcontentloaded
      timeout: 10000      // Reduced timeout
    });
    
    // Calculate estimated content height based on form data (faster than DOM evaluation)
    console.log('Calculating optimal PDF height...');
    const estimatedHeight = (() => {
      let height = 400; // Base height for header/cover
      
      // Add height estimates based on content
      if (safeFormData.hotels.length > 0) height += safeFormData.hotels.length * 180;
      if (safeFormData.experiences.length > 0) height += safeFormData.experiences.length * 180;
      if (safeFormData.dayWiseItinerary.length > 0) height += safeFormData.dayWiseItinerary.length * 250;
      if (safeFormData.practicalInfo.tips.length > 0) height += safeFormData.practicalInfo.tips.length * 40;
      if (safeFormData.cityImages && safeFormData.cityImages.length > 0) height += safeFormData.cityImages.length * 150;
      
      // Add base sections (overview, practical info, etc.)
      height += 600;
      
      // Ensure reasonable bounds
      return Math.min(Math.max(height, 800), 6000); // Between 800px and 6000px
    })();
    
    console.log(`Estimated content height: ${estimatedHeight}px`);
    
    // Generate PDF with optimal height
    console.log('Generating PDF with optimal dimensions...');
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      width: '420px',
      height: `${estimatedHeight}px`,  // Smart estimated height based on content
      pageRanges: '1',
      timeout: 10000
    });

    await page.close();
    await browser.close();

    console.log(`Fast PDF generated successfully. Size: ${pdf.length} bytes`);
    
    // Sanitize filename to remove Unicode characters that break headers
    const sanitizeFilename = (filename: string): string => {
      return filename
        .replace(/[^\w\s-]/g, '') // Remove special characters, keep letters, numbers, spaces, hyphens
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim()                   // Remove leading/trailing whitespace
        .substring(0, 50);        // Limit length
    };

    const safeFilename = sanitizeFilename(formData.title || 'itinerary');
    
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
        'Content-Length': pdf.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Ensure browser is closed on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

// DIRECT image loading - NO self-referential API calls - FAST MODE
async function loadPreviewImagesDirect(data: ItineraryFormData) {
  // PERFORMANCE OPTIMIZATION: Use fast placeholders instead of API calls
  const getFastPlaceholder = (type: 'main' | 'hotel' | 'experience' | 'day' | 'city', index: number = 0): string => {
    const baseRandoms = {
      main: 1000,
      hotel: 2000,
      experience: 3000,
      day: 4000,
      city: 5000
    };
    return `https://picsum.photos/600/400?random=${baseRandoms[type] + index}`;
  };

  const newImages = {
    main: data.mainImage || getFastPlaceholder('main'),
    hotels: (data.hotels || []).map((hotel, index) => hotel.image || getFastPlaceholder('hotel', index)),
    experiences: (data.experiences || []).map((experience, index) => experience.image || getFastPlaceholder('experience', index)),
    days: (data.dayWiseItinerary || []).map((day, index) => day.image || getFastPlaceholder('day', index)),
    cities: (data.cityImages || []).map((_, index) => getFastPlaceholder('city', index))
  };

  console.log('Fast placeholder images loaded instantly');
  return newImages;
}

// Generate HTML document with the rendered React component
function generateHtmlDocument(componentHtml: string, data: ItineraryFormData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title || 'Travel Itinerary'}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Manrope', sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          width: 420px;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        /* CRITICAL: Map font-manrope class to Manrope font family */
        .font-manrope {
          font-family: 'Manrope', sans-serif !important;
        }
        
        /* CRITICAL: Ensure all font weights match exactly with web preview */
        .font-light { font-weight: 300 !important; }
        .font-normal { font-weight: 400 !important; }
        .font-medium { font-weight: 500 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-bold { font-weight: 700 !important; }
        
        /* CRITICAL: Ensure text sizes match exactly with web preview */
        .text-xs { font-size: 0.75rem !important; }
        .text-sm { font-size: 0.875rem !important; }
        .text-base { font-size: 1rem !important; }
        .text-lg { font-size: 1.125rem !important; }
        .text-xl { font-size: 1.25rem !important; }
        .text-2xl { font-size: 1.5rem !important; }
        .text-3xl { font-size: 1.875rem !important; }
        .text-4xl { font-size: 2.25rem !important; }
        
        /* CRITICAL: Ensure letter spacing matches exactly */
        .tracking-wide { letter-spacing: 0.025em !important; }
        .tracking-tight { letter-spacing: -0.025em !important; }
        
        /* CRITICAL: Ensure line heights match exactly */
        .leading-tight { line-height: 1.25 !important; }
        .leading-relaxed { line-height: 1.625 !important; }
        .leading-none { line-height: 1 !important; }
        
        /* FORCE continuous mobile layout - ELIMINATE ALL page breaks */
        * {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-before: avoid !important;
          page-break-after: avoid !important;
        }
        
        /* Override any existing page break classes */
        .page-break, .avoid-break, .page-break-before, .page-break-after {
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          break-before: avoid !important;
          break-after: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Ensure content flows continuously */
        body, html {
          height: auto !important;
          min-height: auto !important;
        }
        
        /* Image loading optimization */
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body class="bg-white text-gray-900">
      ${componentHtml}
    </body>
    </html>
  `;
} 