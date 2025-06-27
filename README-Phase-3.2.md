# Phase 3.2 - AI-Powered Extraction API 

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key
Create a `.env.local` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Get your API key from:** https://platform.openai.com/api-keys

### 3. Build and Test
```bash
npm run build
npm run dev
```

### 4. Test the API

**Text Extraction:**
```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "Day 1: Arrive in Paris\nVisit Eiffel Tower\nDinner at cafe\n\nDay 2: Louvre Museum\nSeine river cruise"}'
```

**URL Extraction:**
```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/travel-blog"}'
```

**PDF Extraction:**
```bash
curl -X POST http://localhost:3000/api/extract \
  -F "pdf=@itinerary.pdf"
```

## 📊 API Response Format

**Success Response (200):**
```json
{
  "data": {
    "title": "Amazing Paris Adventure",
    "destination": "Paris, France",
    "duration": "2 days",
    "routing": "Charles de Gaulle Airport → Central Paris",
    "tags": ["cultural", "romantic", "city-break"],
    "tripType": "Cultural",
    "hotels": ["Hotel Example", "Boutique Hotel Paris"],
    "experiences": ["Eiffel Tower visit", "Louvre Museum tour"],
    "practicalInfo": {
      "visa": "No visa required for EU citizens",
      "currency": "Euro (EUR). Budget: €100-150/day",
      "tips": ["Book museum tickets in advance", "Learn basic French phrases"]
    },
    "dayWiseItinerary": [
      {
        "day": 1,
        "title": "Arrival and City Center",
        "content": "09:00 - Arrive at CDG Airport\n12:00 - Check into hotel\n14:00 - Visit Eiffel Tower\n19:00 - Dinner at local cafe"
      }
    ],
    "withKids": "Family-friendly attractions include...",
    "withFamily": "Multi-generational travel tips...",
    "offbeatSuggestions": "Hidden gems and local secrets..."
  }
}
```

**Error Response (400/422/503):**
```json
{
  "error": "Descriptive error message"
}
```

## 🛠 Features Implemented

### ✅ Input Types Supported
- **Text**: Direct text content extraction
- **URL**: Web page content scraping and extraction  
- **PDF**: PDF file text extraction and processing

### ✅ AI Processing
- **OpenAI GPT-4o-mini**: Optimal cost/performance balance
- **Structured Prompts**: Detailed extraction guidelines
- **Schema Validation**: Ensures consistent output format

### ✅ Error Handling
- **Input Validation**: Pre-processing validation
- **Network Timeouts**: 30-second URL fetch timeout
- **File Size Limits**: 10MB maximum for PDFs
- **AI Error Recovery**: Graceful handling of AI service issues

### ✅ Security & Performance
- **Input Sanitization**: URL and file validation
- **Content Filtering**: Removes scripts and malicious content
- **Token Optimization**: 8,000 character limit for cost control
- **Proper Error Messages**: User-friendly without exposing system details

## 🔧 Configuration Options

### Environment Variables
```env
# Required
OPENAI_API_KEY=sk-...

# Optional (with defaults)
PDF_MAX_SIZE_MB=10
URL_TIMEOUT_SECONDS=30
AI_MAX_TOKENS=3000
AI_TEMPERATURE=0.3
```

### File Limits
- **PDF Size**: 10MB maximum
- **Text Length**: 8,000 characters (token optimization)
- **URL Timeout**: 30 seconds

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add `OPENAI_API_KEY` to environment variables
3. Deploy automatically

### Other Platforms
- **Netlify**: Add environment variables in site settings
- **Railway**: Configure environment in project settings
- **Custom Server**: Ensure Node.js 18+ and environment variables

## 🧪 Testing

### Manual Testing
1. Navigate to `/itinerary` page
2. Use SmartInput component to test all three input types
3. Verify extraction results in the form

### API Testing
Use the curl commands above or tools like Postman to test the API directly.

## 💡 Usage Tips

### For Best Results
- **Text Input**: Use clear, structured content with day-wise information
- **URL Input**: Ensure URLs contain travel/itinerary content
- **PDF Input**: Use PDFs with selectable text (not scanned images)

### Error Recovery
- **Invalid URLs**: Check URL accessibility and content
- **Large PDFs**: Reduce file size or use text extraction
- **AI Failures**: Retry with simpler content or check API key

## 📚 Technical Details

### Dependencies Added
- `openai@^4.67.3` - OpenAI API client
- `pdf-parse@^1.1.1` - PDF text extraction
- `cheerio@^1.0.0-rc.12` - HTML parsing
- `zod@^3.23.8` - Schema validation

### Files Created
- `app/api/extract/route.ts` - Main API endpoint
- `lib/schemas.ts` - Zod validation schemas
- `lib/types.ts` - Shared TypeScript types
- `lib/extractors/url-extractor.ts` - URL content extraction
- `lib/extractors/pdf-extractor.ts` - PDF text extraction  
- `lib/prompts/itinerary-prompt.ts` - AI prompt templates

### Component Updates
- `components/smart-input.tsx` - Updated to use new API
- All itinerary components - Updated to use shared types

## 🎯 Next Steps

1. **Configure OpenAI API Key** - Essential for functionality
2. **Test All Input Types** - Verify everything works as expected
3. **Deploy to Production** - Ready for production use
4. **Monitor Usage** - Track API usage and costs
5. **Gather User Feedback** - Improve based on real usage

---

**Need Help?** Check the detailed CTO report in `reports/phase-3.2-extraction-api-report.md` for comprehensive technical documentation. 