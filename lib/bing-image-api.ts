// Unsplash API utility
// Docs: https://unsplash.com/documentation

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export interface ImageSearchResult {
  thumbnailUrl: string;
  webUrl: string;
  title: string;
  source: string;
  photographer: string;
}

/**
 * Search for images using Unsplash API
 */
export async function searchImages(
  query: string, 
  count: number = 10
): Promise<ImageSearchResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    console.warn('Unsplash API key not configured. Falling back to source URL.');
    return [];
  }

  try {
    const searchUrl = new URL('https://api.unsplash.com/search/photos');
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('per_page', count.toString());
    searchUrl.searchParams.set('orientation', 'landscape');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept-Version': 'v1'
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    
    return data.results.map(photo => ({
      thumbnailUrl: photo.urls.small,
      webUrl: photo.urls.regular,
      title: photo.alt_description || photo.description || 'Travel image',
      source: 'unsplash',
      photographer: photo.user.name
    }));

  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
}

/**
 * Get a single placeholder image for keywords
 */
export async function getPlaceholderImage(keywords: string): Promise<string | null> {
  try {
    const results = await searchImages(keywords, 1);
    return results[0]?.webUrl || null;
  } catch (error) {
    console.error('Error getting placeholder image:', error);
    return null;
  }
}

/**
 * Fallback to Unsplash source URL (no API key required)
 */
export function getUnsplashFallback(keywords: string): string {
  const query = encodeURIComponent(keywords);
  return `https://source.unsplash.com/800x600/?${query}`;
}

/**
 * Get image URL with fallback strategy
 */
export async function getImageUrl(keywords: string): Promise<string> {
  // Try Unsplash API first
  const unsplashImage = await getPlaceholderImage(keywords);
  if (unsplashImage) {
    return unsplashImage;
  }
  
  // Fallback to source URL
  return getUnsplashFallback(keywords);
} 