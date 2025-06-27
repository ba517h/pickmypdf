import * as cheerio from "cheerio";

/**
 * Extract readable text content from a URL
 * Fetches the HTML and extracts meaningful text using cheerio
 */
export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PickMyPDF/1.0; +https://pickmypdf.com)',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Load HTML with cheerio
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, header, footer, aside, .sidebar, .navigation, .menu').remove();

    // Extract text from common content areas
    const contentSelectors = [
      'main',
      'article', 
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.blog-content',
      'div[role="main"]',
      '#content',
      '#main',
      '.container',
    ];

    let extractedText = '';

    // Try content-specific selectors first
    for (const selector of contentSelectors) {
      const content = $(selector).first();
      if (content.length && content.text().trim().length > 100) {
        extractedText = content.text().trim();
        break;
      }
    }

    // Fallback to body if no content area found
    if (!extractedText) {
      extractedText = $('body').text().trim();
    }

    // Clean up the text
    extractedText = extractedText
      .replace(/\s+/g, ' ')           // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n')      // Replace multiple newlines with single newline
      .trim();

    if (extractedText.length < 50) {
      throw new Error("Insufficient content extracted from URL");
    }

    // Limit text length to prevent token overflow
    if (extractedText.length > 8000) {
      extractedText = extractedText.substring(0, 8000) + "...";
    }

    return extractedText;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`URL extraction failed: ${error.message}`);
    }
    throw new Error("URL extraction failed: Unknown error");
  }
}

/**
 * Validate if a URL is likely to contain travel itinerary content
 * This is a helper function for additional validation if needed
 */
export function validateTravelUrl(url: string): boolean {
  const travelKeywords = [
    'travel', 'trip', 'itinerary', 'vacation', 'holiday',
    'tour', 'journey', 'destination', 'visit', 'guide',
    'blog', 'review', 'experience'
  ];

  const urlLower = url.toLowerCase();
  return travelKeywords.some(keyword => urlLower.includes(keyword));
} 