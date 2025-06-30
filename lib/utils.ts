import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get fallback image for a destination with consistent fallback strategy
 * Prioritizes: data.cityImages[0] > API call based on destination > default placeholder
 */
export function getFallbackImage(data: { 
  cityImages?: Array<{ city: string; image?: string }>; 
  destination?: string;
  mainImage?: string;
}): string {
  // First priority: user's main image
  if (data.mainImage) {
    return data.mainImage;
  }
  
  // Second priority: first city image if available
  if (data.cityImages && data.cityImages.length > 0 && data.cityImages[0].image) {
    return data.cityImages[0].image;
  }
  
  // Third priority: generate image URL based on destination
  if (data.destination) {
    // This will be used by components to trigger API call
    return `destination:${data.destination}`;
  }
  
  // Final fallback: default placeholder
  return `https://picsum.photos/800/400?random=1`;
}

/**
 * Process the fallback image result to get actual URL
 */
export async function processFallbackImage(fallbackResult: string): Promise<string> {
  if (fallbackResult.startsWith('destination:')) {
    const destination = fallbackResult.replace('destination:', '');
    try {
      const response = await fetch(`/api/images?q=${encodeURIComponent(`${destination} landscape destination`)}&type=single`);
      const imageData = await response.json();
      if (imageData.imageUrl) {
        return imageData.imageUrl;
      }
    } catch (error) {
      console.log('Failed to fetch destination image, using fallback');
    }
    return `https://picsum.photos/800/400?random=${Date.now()}`;
  }
  
  return fallbackResult;
}
