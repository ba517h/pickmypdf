import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { ItineraryFormData } from '@/lib/types';
import { PdfMobileTemplate } from '@/components/itinerary/pdf-mobile-template';
import { getImageUrl } from '@/lib/bing-image-api';

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
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-background-networking',
        '--memory-pressure-off',
        '--disable-extensions'
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

// Export function configuration for Vercel
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const formData: ItineraryFormData = await request.json();
    
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
    
    // Load images using DIRECT function calls (no self-referential API calls)
    console.log('Loading preview images...');
    const previewImages = await loadPreviewImagesDirect(safeFormData);
    console.log('Preview images loaded');
    
    // Render the actual React component to HTML using dynamic import
    console.log('Importing React DOM server...');
    const { renderToString } = await import('react-dom/server');
    console.log('Rendering React component...');
    const componentHtml = renderToString(
      React.createElement(PdfMobileTemplate, {
        data: safeFormData,
        previewImages: previewImages
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

    // Performance optimizations for faster PDF generation
    await page.setViewport({ width: 420, height: 1080, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => {
      // Disable animations for faster rendering
      const css = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      const style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    });
    
    console.log('Setting HTML content for PDF generation...');
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('Generating PDF...');
    const pdf = await page.pdf({
      width: '420px',
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 20000
    });

    await page.close();
    await browser.close();

    console.log(`PDF generated successfully. Size: ${pdf.length} bytes`);
    
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="itinerary.pdf"',
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

// DIRECT image loading - NO self-referential API calls
async function loadPreviewImagesDirect(data: ItineraryFormData) {
  // Function to get or generate image for preview - DIRECT function calls
  const getPreviewImage = async (keywords: string, type: 'main' | 'hotel' | 'experience' | 'day' | 'city', index: number = 0): Promise<string> => {
    try {
      // Call the function directly instead of making HTTP requests
      const imageUrl = await getImageUrl(keywords);
      if (imageUrl) {
        return imageUrl;
      }
    } catch (error) {
      console.log('Failed to fetch image, using fallback');
    }
    
    // Fallback to high-quality placeholder
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
    main: "",
    hotels: [] as string[],
    experiences: [] as string[],
    days: [] as string[],
    cities: [] as string[]
  };

  // Main image - prioritize form data
  if (data.mainImage) {
    newImages.main = data.mainImage;
  } else if (data.destination) {
    newImages.main = await getPreviewImage(`${data.destination} landscape destination`, 'main');
  }

  // Hotel images with parallel processing and error handling
  const safeHotels = data.hotels || [];
  try {
    const hotelPromises = safeHotels.map(async (hotel, index) => {
      if (hotel.image) {
        return hotel.image;
      }
      const keywords = `${hotel.name} ${data.destination || 'luxury'} hotel accommodation`;
      return await getPreviewImage(keywords, 'hotel', index);
    });
    newImages.hotels = await Promise.all(hotelPromises);
  } catch (error) {
    console.error('Error loading hotel images:', error);
    newImages.hotels = safeHotels.map((_, index) => `https://picsum.photos/600/400?random=${2000 + index}`);
  }

  // Experience images with parallel processing and error handling
  const safeExperiences = data.experiences || [];
  try {
    const experiencePromises = safeExperiences.map(async (experience, index) => {
      if (experience.image) {
        return experience.image;
      }
      const keywords = `${experience.name} ${data.destination || 'travel'} activity experience`;
      return await getPreviewImage(keywords, 'experience', index);
    });
    newImages.experiences = await Promise.all(experiencePromises);
  } catch (error) {
    console.error('Error loading experience images:', error);
    newImages.experiences = safeExperiences.map((_, index) => `https://picsum.photos/600/400?random=${3000 + index}`);
  }

  // Day images with parallel processing and error handling
  const safeDayWiseItinerary = data.dayWiseItinerary || [];
  try {
    const dayPromises = safeDayWiseItinerary.map(async (day, index) => {
      if (day.image) {
        return day.image;
      }
      const keywords = `${day.title} ${data.destination || 'travel'} tour activity`;
      return await getPreviewImage(keywords, 'day', index);
    });
    newImages.days = await Promise.all(dayPromises);
  } catch (error) {
    console.error('Error loading day images:', error);
    newImages.days = safeDayWiseItinerary.map((_, index) => `https://picsum.photos/600/400?random=${4000 + index}`);
  }

  // City images with parallel processing and error handling
  const safeCityImages = data.cityImages || [];
  if (safeCityImages.length > 0) {
    try {
      const cityPromises = safeCityImages.map(async (cityImage, index) => {
        if (cityImage.image) {
          return cityImage.image;
        }
        const keywords = `${cityImage.city} ${data.destination || 'city'} landmark skyline`;
        return await getPreviewImage(keywords, 'city', index);
      });
      newImages.cities = await Promise.all(cityPromises);
    } catch (error) {
      console.error('Error loading city images:', error);
      newImages.cities = safeCityImages.map((_, index) => `https://picsum.photos/600/400?random=${5000 + index}`);
    }
  }

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