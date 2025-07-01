# Environment Setup Instructions

## Required Environment Variables

Add the following variables to your `.env.local` file:

```bash
# TripAdvisor API Configuration (NEW - Phase 11.3)
# Get this from TripAdvisor Content API
TRIPADVISOR_API_KEY="your-tripadvisor-api-key-here"

# Unsplash API Configuration
# Get this from Unsplash Developers
UNSPLASH_ACCESS_KEY="your-unsplash-access-key-here"

# Your existing variables...
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
SUPABASE_JWT_SECRET="your-jwt-secret-here"
OPENAI_API_KEY="your-openai-api-key-here"
```

## How to Get TripAdvisor API Key (NEW)

### Step 1: Sign up for TripAdvisor Content API
1. Go to [TripAdvisor Content API](https://www.tripadvisor.com/developers)
2. Create a TripAdvisor developer account
3. Complete your profile and verify your email

### Step 2: Create API Application
1. Navigate to "My Projects" in your developer dashboard
2. Click "Create New Project"
3. Fill out your application details:
   - **Project Name**: "PickMyPDF Hotel Integration"
   - **Description**: "AI-powered travel itinerary with hotel ratings"
   - **Website URL**: Your application URL

### Step 3: Get Your API Key
1. After project approval, go to your project dashboard
2. Copy your **API Key** - this is your `TRIPADVISOR_API_KEY`
3. Note: Use the API key you provided: `64055924836B4CEDB842B3C56E69E273`

### Pricing & Limits
- **Pay-per-use model**: Only pay for what you use
- **Up to 50 calls per second**
- **Set daily spending limits** to control costs
- **Cancel anytime** - no long-term commitments

### TripAdvisor API Features
- 🏨 **Hotel Search**: Find hotels by name and location
- ⭐ **Real Ratings**: Get actual TripAdvisor ratings and reviews
- 📸 **Hotel Images**: Access professional hotel photography
- 🔍 **Location Search**: Find hotels by destination
- 💬 **Reviews**: Extract review summaries and descriptions

## How to Get Unsplash API Key

### Step 1: Create Unsplash Account
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Sign up for a free Unsplash account
3. Accept the developer terms

### Step 2: Create New Application
1. Click "New Application"
2. Accept the API/Developer Terms
3. Fill out the application form:
   - **Application name**: "PickMyPDF Travel Planner"
   - **Description**: "AI-powered travel itinerary generator with image integration"
   - **Website**: Your domain or `http://localhost:3000` for development

### Step 3: Get Access Key
1. After creating the app, you'll see your application dashboard
2. Copy the **Access Key** - this is your `UNSPLASH_ACCESS_KEY`
3. Save the **Secret Key** securely (for future server-side operations)

## API Limits and Pricing

### Free Tier (Demo)
- **50 requests/hour**
- **5,000 requests/month**
- **Perfect for development and small projects**

### Production Tier
- **5,000 requests/hour**
- **200,000 requests/month**
- **Request production access once ready**

## Benefits of Unsplash vs Alternatives

| Feature | Unsplash Source | Unsplash API | Bing Search |
|---------|----------------|--------------|-------------|
| **API Key Required** | ❌ No | ✅ Yes | ✅ Yes |
| **Rate Limits** | ⚠️ Uncontrolled | ✅ Controlled | ✅ Controlled |
| **Image Quality** | ✅ High | ✅ Highest | ✅ High |
| **Search Accuracy** | ⚠️ Basic | ✅ Excellent | ✅ Good |
| **Commercial Use** | ✅ Free | ✅ Free | 💰 Paid |
| **Attribution** | ⚠️ Optional | ✅ Required | ❌ None |
| **Cost** | 🆓 Free | 🆓 Free | 💰 $4/1000 |
| **Setup Complexity** | ✅ Simple | ✅ Simple | ⚠️ Complex |

## Current Implementation

The system uses a **fallback strategy**:

1. **Unsplash Source URL** (Primary): `https://source.unsplash.com/800x600/?{keywords}`
   - No API key required
   - Unlimited usage
   - Good quality images
   - Simple refresh mechanism

2. **Unsplash API** (Optional Enhancement): For better search results when API key is provided
   - Higher quality search results
   - Better keyword matching
   - Photographer attribution
   - Usage analytics

## Implementation Features

The current ImageInput component includes:

- ✅ **Unsplash Source Integration** (no API key needed)
- ✅ **Refresh Button** to get new images
- ✅ **Drag & Drop Upload** for custom images
- ✅ **Image Preview** with hover effects
- ✅ **Error Handling** with graceful fallbacks
- ✅ **Responsive Design** for all screen sizes

## Setup Options

### Option 1: No Setup Required (Current)
- Uses `source.unsplash.com` directly
- No API key needed
- Works immediately
- Good for development and testing

### Option 2: API Integration (Optional)
If you want better search results:

1. Add `UNSPLASH_ACCESS_KEY` to `.env.local`
2. The system will automatically use the API
3. Falls back to source URL if API fails

## Testing the Setup

### Without API Key
1. Start development server: `npm run dev`
2. Create a new itinerary
3. Images should load from Unsplash source URL
4. Refresh button will get new random images

### With API Key
1. Add `UNSPLASH_ACCESS_KEY` to `.env.local`
2. Restart server: `npm run dev`
3. Images will use API search results
4. Better keyword matching and quality

## Troubleshooting

### Images Not Loading
- Check internet connection
- Verify Unsplash isn't blocked by firewall
- Try refreshing the page
- Check browser console for errors

### API Key Issues (If Using API)
- Verify API key is correct in `.env.local`
- Check Unsplash developer dashboard
- Ensure app isn't rate limited
- Restart development server

### Performance Issues
- Images load lazily to improve performance
- Refresh button adds timestamp to prevent caching
- Source URL is used as fallback for reliability

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different keys** for development/production
3. **Monitor usage** in Unsplash dashboard
4. **Follow attribution guidelines** if required
5. **Respect rate limits** to avoid throttling

## Future Enhancements

- **Image caching** to reduce API calls
- **Multiple image selection** per section
- **Image size optimization** for different uses
- **Custom search filters** (orientation, color, etc.)
- **Photographer attribution** display
- **Usage analytics** dashboard

## API Usage Attribution

When using Unsplash API in production, you should:

1. **Credit photographers** when possible
2. **Follow Unsplash Guidelines** for attribution
3. **Link back to Unsplash** in footer or credits
4. **Respect community guidelines** for image usage

Example attribution:
```
Photo by [Photographer Name] on Unsplash
``` 