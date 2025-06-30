import { useState, useEffect } from 'react';
import { ItineraryFormData } from '@/lib/types';

export interface PreviewImages {
  main: string;
  hotels: string[];
  experiences: string[];
  days: string[];
  cities: string[];
}

export function usePreviewImages(data: ItineraryFormData) {
  const [previewImages, setPreviewImages] = useState<PreviewImages>({
    main: "",
    hotels: [],
    experiences: [],
    days: [],
    cities: []
  });

  const [isLoading, setIsLoading] = useState(false);

  // Function to get or generate image for preview
  const getPreviewImage = async (keywords: string, type: 'main' | 'hotel' | 'experience' | 'day' | 'city', index: number = 0): Promise<string> => {
    try {
      const response = await fetch(`/api/images?q=${encodeURIComponent(keywords)}&type=single`);
      const imageData = await response.json();
      if (imageData.imageUrl) {
        return imageData.imageUrl;
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

  // Load images for preview
  useEffect(() => {
    const loadPreviewImages = async () => {
      if (!data.destination && data.hotels.length === 0 && data.experiences.length === 0 && data.dayWiseItinerary.length === 0) {
        return;
      }

      setIsLoading(true);
      
      const newImages = {
        main: "",
        hotels: [] as string[],
        experiences: [] as string[],
        days: [] as string[],
        cities: [] as string[]
      };

      try {
        // Main image - prioritize form data
        if (data.mainImage) {
          newImages.main = data.mainImage;
        } else if (data.cityImages && data.cityImages.length > 0 && data.cityImages[0].image) {
          newImages.main = data.cityImages[0].image;
        } else if (data.destination) {
          newImages.main = await getPreviewImage(`${data.destination} landscape destination`, 'main');
        }

        // Hotel images
        const hotelPromises = data.hotels.map(async (hotel, index) => {
          if (hotel.image) {
            return hotel.image;
          }
          const keywords = `${hotel.name} ${data.destination || 'luxury'} hotel accommodation`;
          return await getPreviewImage(keywords, 'hotel', index);
        });
        newImages.hotels = await Promise.all(hotelPromises);

        // Experience images  
        const experiencePromises = data.experiences.map(async (experience, index) => {
          if (experience.image) {
            return experience.image;
          }
          const keywords = `${experience.name} ${data.destination || 'travel'} activity experience`;
          return await getPreviewImage(keywords, 'experience', index);
        });
        newImages.experiences = await Promise.all(experiencePromises);

        // Day images
        const dayPromises = data.dayWiseItinerary.map(async (day, index) => {
          if (day.image) {
            return day.image;
          }
          const keywords = `${day.title} ${data.destination || 'travel'} tour activity`;
          return await getPreviewImage(keywords, 'day', index);
        });
        newImages.days = await Promise.all(dayPromises);

        // City images
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

        setPreviewImages(newImages);
      } catch (error) {
        console.error('Error loading preview images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviewImages();
  }, [data]);

  return {
    previewImages,
    isLoading
  };
} 