import { useState, useEffect, useRef } from 'react';
import { ItineraryFormData } from '@/lib/types';

export interface PreviewImages {
  main: string;
  hotels: string[];
  experiences: string[];
  days: string[];
  cities: string[];
}

// Cache for image URLs
const imageCache = new Map<string, string>();

export function usePreviewImages(data: ItineraryFormData) {
  const [previewImages, setPreviewImages] = useState<PreviewImages>({
    main: "",
    hotels: [],
    experiences: [],
    days: [],
    cities: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clear cache when data changes significantly
  useEffect(() => {
    imageCache.clear();
  }, [data.mainImage, data.hotels.map(h => h.image).join(','), data.experiences.map(e => e.image).join(','), data.dayWiseItinerary.map(d => d.image).join(','), data.cityImages?.map(c => c.image).join(',')]);

  // Function to get or generate image for preview with caching
  const getPreviewImage = async (keywords: string, type: 'main' | 'hotel' | 'experience' | 'day' | 'city', index: number = 0): Promise<string> => {
    // Check cache first
    const cacheKey = `${keywords}-${type}-${index}`;
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`/api/images?q=${encodeURIComponent(keywords)}&type=single`, {
        signal: abortControllerRef.current?.signal
      });
      const imageData = await response.json();
      if (imageData.imageUrl) {
        // Transform non-data URLs
        const imageUrl = imageData.imageUrl.startsWith('data:') ? imageData.imageUrl 
          : `https://images.weserv.nl/?url=${encodeURIComponent(imageData.imageUrl)}&w=800&output=jpg&q=75&n=1`;
        // Cache the result
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw error;
      }
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
    const fallbackUrl = `https://picsum.photos/800/600?random=${baseRandoms[type] + index}`;
    imageCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  };

  // Load images for preview
  useEffect(() => {
    const loadPreviewImages = async () => {
      if (!data.destination && data.hotels.length === 0 && data.experiences.length === 0 && data.dayWiseItinerary.length === 0) {
        return;
      }

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      
      const newImages = {
        main: "",
        hotels: [] as string[],
        experiences: [] as string[],
        days: [] as string[],
        cities: [] as string[]
      };

      try {
        // Load all images in parallel
        const promises: Promise<void>[] = [];

        // Main image promise
        if (!data.mainImage && !data.cityImages?.[0]?.image && data.destination) {
          promises.push(
            getPreviewImage(`${data.destination} landscape destination`, 'main')
              .then(url => { newImages.main = url; })
          );
        } else {
          // Transform non-data URLs
          const mainImage = data.mainImage || data.cityImages?.[0]?.image || "";
          newImages.main = mainImage.startsWith('data:') ? mainImage 
            : mainImage ? `https://images.weserv.nl/?url=${encodeURIComponent(mainImage)}&w=800&output=jpg&q=75&n=1` : "";
        }

        // Hotel images promises
        data.hotels.forEach((hotel, index) => {
          if (hotel.image) {
            // Transform non-data URLs
            newImages.hotels[index] = hotel.image.startsWith('data:') ? hotel.image 
              : `https://images.weserv.nl/?url=${encodeURIComponent(hotel.image)}&w=800&output=jpg&q=75&n=1`;
          } else {
            const keywords = `${hotel.name} ${data.destination || 'luxury'} hotel accommodation`;
            promises.push(
              getPreviewImage(keywords, 'hotel', index)
                .then(url => { newImages.hotels[index] = url; })
            );
          }
        });

        // Experience images promises
        data.experiences.forEach((experience, index) => {
          if (experience.image) {
            // Transform non-data URLs
            newImages.experiences[index] = experience.image.startsWith('data:') ? experience.image 
              : `https://images.weserv.nl/?url=${encodeURIComponent(experience.image)}&w=800&output=jpg&q=75&n=1`;
          } else {
            const keywords = `${experience.name} ${data.destination || 'travel'} activity experience`;
            promises.push(
              getPreviewImage(keywords, 'experience', index)
                .then(url => { newImages.experiences[index] = url; })
            );
          }
        });

        // Day images promises
        data.dayWiseItinerary.forEach((day, index) => {
          if (day.image) {
            // Transform non-data URLs
            newImages.days[index] = day.image.startsWith('data:') ? day.image 
              : `https://images.weserv.nl/?url=${encodeURIComponent(day.image)}&w=800&output=jpg&q=75&n=1`;
          } else {
            const keywords = `${day.title} ${data.destination || 'travel'} tour activity`;
            promises.push(
              getPreviewImage(keywords, 'day', index)
                .then(url => { newImages.days[index] = url; })
            );
          }
        });

        // City images promises
        data.cityImages?.forEach((cityImage, index) => {
          if (cityImage.image) {
            // Transform non-data URLs
            newImages.cities[index] = cityImage.image.startsWith('data:') ? cityImage.image 
              : `https://images.weserv.nl/?url=${encodeURIComponent(cityImage.image)}&w=800&output=jpg&q=75&n=1`;
          } else {
            const keywords = `${cityImage.city} ${data.destination || 'city'} landmark skyline`;
            promises.push(
              getPreviewImage(keywords, 'city', index)
                .then(url => { newImages.cities[index] = url; })
            );
          }
        });

        // Wait for all images to load in parallel
        await Promise.all(promises);
        setPreviewImages(newImages);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error loading preview images:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviewImages();

    // Cleanup function to abort any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [data]);

  return {
    previewImages,
    isLoading
  };
} 