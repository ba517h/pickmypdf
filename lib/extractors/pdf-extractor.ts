// Dynamic import to avoid build issues with pdf-parse

/**
 * Extract text content from a PDF file
 * Uses pdf-parse library to extract raw text from PDF buffer
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new Error("PDF file too large. Maximum size is 10MB.");
    }

    // Dynamic import pdf-parse to avoid build issues
    const pdf = (await import("pdf-parse")).default;
    
    // Extract text using pdf-parse
    const data = await pdf(buffer, {
      // Configure pdf-parse options
      max: 50, // Maximum number of pages to parse
    });

    let extractedText = data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text content found in PDF");
    }

    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\f/g, '\n')           // Replace form feeds with newlines
      .replace(/\r\n/g, '\n')         // Normalize line endings
      .replace(/\r/g, '\n')           // Normalize line endings
      .replace(/\s+/g, ' ')           // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n')      // Replace multiple newlines with single newline
      .trim();

    // Validate minimum content length
    if (extractedText.length < 50) {
      throw new Error("PDF contains insufficient text content for processing");
    }

    // Limit text length to prevent token overflow
    if (extractedText.length > 8000) {
      extractedText = extractedText.substring(0, 8000) + "...";
    }

    // Log extraction info (remove in production)
    console.log(`PDF extraction successful: ${data.numpages} pages, ${extractedText.length} characters`);

    return extractedText;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
    throw new Error("PDF extraction failed: Unknown error");
  }
}

/**
 * Validate PDF file before processing
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: "File must be a PDF" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "PDF file too large. Maximum size is 10MB." };
  }

  // Check minimum file size (to avoid empty files)
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    return { valid: false, error: "PDF file appears to be empty or corrupted" };
  }

  return { valid: true };
} 