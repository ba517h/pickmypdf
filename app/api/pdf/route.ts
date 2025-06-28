import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import React from 'react';
import { ItineraryFormData } from '@/lib/types';
import { PdfMobileTemplate } from '@/components/itinerary/pdf-mobile-template';

export async function POST(request: NextRequest) {
  try {
    const formData: ItineraryFormData = await request.json();
    
    // Load images using the SAME logic as PdfPreview component
    const previewImages = await loadPreviewImages(formData);
    
    // Render the actual React component to HTML using dynamic import
    const { renderToString } = await import('react-dom/server');
    const componentHtml = renderToString(
      React.createElement(PdfMobileTemplate, {
        data: formData,
        previewImages: previewImages
      })
    );
    
    // Generate complete HTML document
    const htmlContent = generateHtmlDocument(componentHtml, formData);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set mobile viewport for consistent rendering
    await page.setViewport({
      width: 420,
      height: 800,
      deviceScaleFactor: 2
    });
    
    // Set content and wait for images to load
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // Get actual content height for truly continuous PDF
    const contentHeight = await page.evaluate(() => {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
    });

    // Generate truly continuous PDF - single page with exact content height
    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: false,  // Don't use CSS page size
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      // Force single continuous page with exact dimensions
      width: '420px',
      height: `${contentHeight}px`,  // Exact height = no page breaks!
      pageRanges: '1',  // Single page only
    });
    
    await browser.close();
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formData.title || 'itinerary'}.pdf"`
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// REAL image loading - EXACT same logic as PdfPreview component
async function loadPreviewImages(data: ItineraryFormData) {
  // Function to get or generate image for preview - EXACT COPY from PdfPreview
  const getPreviewImage = async (keywords: string, type: 'main' | 'hotel' | 'experience' | 'day' | 'city', index: number = 0): Promise<string> => {
    try {
      // Make actual API call to /api/images (same as PdfPreview)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/images?q=${encodeURIComponent(keywords)}&type=single`);
      const imageData = await response.json();
      if (imageData.imageUrl) {
        return imageData.imageUrl;
      }
    } catch (error) {
      console.log('Failed to fetch image, using fallback');
    }
    
    // Fallback to high-quality placeholder - EXACT COPY from PdfPreview
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

  // Main image - prioritize form data - EXACT COPY from PdfPreview
  if (data.mainImage) {
    newImages.main = data.mainImage;
  } else if (data.destination) {
    newImages.main = await getPreviewImage(`${data.destination} landscape destination`, 'main');
  }

  // Hotel images - EXACT COPY from PdfPreview
  const hotelPromises = data.hotels.map(async (hotel, index) => {
    if (hotel.image) {
      return hotel.image;
    }
    const keywords = `${hotel.name} ${data.destination || 'luxury'} hotel accommodation`;
    return await getPreviewImage(keywords, 'hotel', index);
  });
  newImages.hotels = await Promise.all(hotelPromises);

  // Experience images - EXACT COPY from PdfPreview
  const experiencePromises = data.experiences.map(async (experience, index) => {
    if (experience.image) {
      return experience.image;
    }
    const keywords = `${experience.name} ${data.destination || 'travel'} activity experience`;
    return await getPreviewImage(keywords, 'experience', index);
  });
  newImages.experiences = await Promise.all(experiencePromises);

  // Day images - EXACT COPY from PdfPreview
  const dayPromises = data.dayWiseItinerary.map(async (day, index) => {
    if (day.image) {
      return day.image;
    }
    const keywords = `${day.title} ${data.destination || 'travel'} tour activity`;
    return await getPreviewImage(keywords, 'day', index);
  });
  newImages.days = await Promise.all(dayPromises);

  // City images - EXACT COPY from PdfPreview
  if (data.cityImages && data.cityImages.length > 0) {
    const cityPromises = data.cityImages.map(async (cityImage, index) => {
      if (cityImage.image) {
        return cityImage.image;
      }
      const keywords = `${cityImage.city} ${data.destination || 'city'} landmark skyline`;
      return await getPreviewImage(keywords, 'city', index);
    });
    newImages.cities = await Promise.all(cityPromises);
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
      </style>
    </head>
    <body class="bg-white text-gray-900">
      ${componentHtml}
    </body>
    </html>
  `;
} 