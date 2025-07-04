import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  Camera,
  Plane,
  Users,
  Heart,
  Compass
} from "lucide-react";
import { ItineraryFormData } from "@/lib/types";
import { PickMyPDFLogo } from "@/components/icons";

interface PreviewImages {
  main: string;
  hotels: string[];
  experiences: string[];
  days: string[];
  cities: string[];
}

interface PdfMobileTemplateProps {
  data: ItineraryFormData;
  previewImages: PreviewImages;
}

// SVG icon components for server-side rendering (exact Lucide icon paths)
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const CameraIcon = () => (
  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const PlaneIcon = () => (
  <svg className="w-12 h-12 opacity-90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3-3m0-3a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 14-6 6-6-6a5 5 0 0 1 0-7.07L12 2l4.95 4.93A5 5 0 0 1 19 14z"/>
  </svg>
);

const CompassIcon = () => (
  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
  </svg>
);

function getProxiedImageUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.includes('images.weserv.nl')) return url;

  // Handle both http and https URLs
  if (/^https?:\/\//i.test(url)) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=800&h=600&fit=cover&output=jpg&q=75&n=${Date.now()}`;
  }
  
  // Handle relative URLs or other formats
  return `https://picsum.photos/800/600?random=${Date.now()}`;
}

// Server-compatible image component
function StaticImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const imageUrl = getProxiedImageUrl(src);
  
  return (
    <img 
      src={imageUrl}
      alt={alt}
      className={`${className} object-cover`}
    />
  );
}

// Helper function to format destination string
function formatDestination(destination: string) {
  if (!destination) return '';
  const cities = destination.split(',').map(city => city.trim());
  if (cities.length <= 2) return destination;
  return `${cities[0]}, ${cities[1]} +${cities.length - 2} more`;
}

// Helper function to get rating badge style
function getRatingBadgeStyle(rating?: number) {
  if (!rating) return "bg-gray-100 text-gray-600";
  if (rating >= 4.5) return "bg-green-100 text-green-800";
  if (rating >= 4.0) return "bg-blue-100 text-blue-800";
  if (rating >= 3.5) return "bg-yellow-100 text-yellow-800";
  return "bg-orange-100 text-orange-800";
}

// Helper function to get rating label
function getRatingLabel(rating?: number) {
  if (!rating) return "Not rated";
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  return "Fair";
}

export function PdfMobileTemplate({ data, previewImages }: PdfMobileTemplateProps) {
  // Ensure all arrays have default values to prevent undefined map errors
  const safeData = {
    ...data,
    tags: data.tags || [],
    hotels: data.hotels || [],
    experiences: data.experiences || [],
    dayWiseItinerary: data.dayWiseItinerary || [],
    practicalInfo: {
      ...data.practicalInfo,
      tips: data.practicalInfo?.tips || []
    },
    destinationGallery: data.destinationGallery || [],
    cityImages: data.cityImages || []
  };
  
  return (
    <div className="h-fit overflow-hidden shadow-lg font-manrope w-full">
      {/* Header Section with Background Image - Cover Page - EXACT COPY */}
      <div className="relative pt-12 pb-12 px-0 text-white overflow-hidden flex flex-col justify-between min-h-[320px]">
        {/* Background Image */}
        {(safeData.mainImage || previewImages.main || safeData.destination) && (
          <>
            <div className="absolute inset-0">
              <StaticImage 
                src={getProxiedImageUrl(safeData.mainImage || previewImages.main || `https://picsum.photos/800/400?random=1`)} 
                alt="Header background" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gradient Overlays for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-blue-800/70 to-blue-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </>
        )}
        
        {/* Fallback solid background if no image */}
        {!previewImages.main && !safeData.destination && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        )}
        
        {/* Content - positioned above background */}
        <div className="relative z-10 flex flex-col justify-between h-full px-6">
          {/* Center Section - Logo and Main Title */}
          <div className="text-center py-12">
            {/* PickMyPDF Logo */}
            <div className="flex justify-center mb-16">
              <PickMyPDFLogo className="w-36 h-auto drop-shadow-lg" />
            </div>
            
            {safeData.title ? (
              <h1 className="text-3xl font-bold mb-6 leading-tight drop-shadow-md max-w-sm mx-auto">{safeData.title}</h1>
            ) : (
              <h1 className="text-3xl font-bold mb-6 leading-tight opacity-80 drop-shadow-md max-w-sm mx-auto">Your Travel Itinerary</h1>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 text-base mb-6">
              {safeData.destination && (
                <div className="flex items-center gap-1 drop-shadow-sm">
                  <MapPinIcon />
                  <span className="font-medium">{formatDestination(safeData.destination)}</span>
                </div>
              )}
              {safeData.duration && (
                <div className="flex items-center gap-1 drop-shadow-sm">
                  <CalendarIcon />
                  <span className="font-medium">{safeData.duration}</span>
                </div>
              )}
            </div>

            {/* Cost in INR Block */}
            <div className="mb-6">
              <div className="inline-block bg-white/25 backdrop-blur-sm text-white rounded-full px-4 py-2 font-semibold text-base drop-shadow-md">
                ₹{safeData.costInINR || "1,42,000 / person"}
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Tags */}
          <div className="flex justify-center pb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {(() => {
                const defaultTags = ["Adventure", "Cultural", "Photography", "Foodie"];
                const displayTags = safeData.tags.length > 0 ? safeData.tags : defaultTags;
                return displayTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-white/25 text-white backdrop-blur-sm drop-shadow-sm">
                    {tag}
                  </Badge>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-0">
        <div className="p-6 space-y-8">
          {/* Overview Section - EXACT COPY */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
              <div className="w-1 h-6 bg-blue-600 rounded" />
              Overview
            </h3>
            <div className="space-y-4 pl-4">
              {safeData.summary && (
                <div className="text-gray-700 leading-relaxed">
                  {safeData.summary}
                </div>
              )}
              {safeData.routing && (
                <div className="text-gray-700 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Routing:</strong> {safeData.routing}
                  </div>
                </div>
              )}

              {!safeData.summary && !safeData.routing && (
                <div className="text-gray-500 italic">
                  Trip overview not added yet.
                </div>
              )}
            </div>
          </div>

          {/* Hotels Section - EXACT COPY */}
          {safeData.hotels.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-green-600 rounded" />
                Accommodations
              </h3>
              
              <div className="space-y-4 pl-4">
                {safeData.hotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Hotel Image */}
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <StaticImage 
                        src={hotel.image || previewImages.hotels[index] || `https://picsum.photos/800/600?random=${index + 1}`}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Hotel Details */}
                    <div className="p-4 space-y-3">
                      {/* Nights and City info */}
                      {(hotel.nights || hotel.city) && (
                        <div className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                          {hotel.nights && `${hotel.nights} NIGHTS STAY`}
                          {hotel.nights && hotel.city && " IN "}
                          {hotel.city && `${hotel.city.toUpperCase()}`}
                        </div>
                      )}
                      
                      {/* Hotel Name */}
                      <h4 className="text-lg font-semibold text-gray-900">{hotel.name}</h4>
                      
                      {/* Rating Display */}
                      {hotel.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => {
                              const isFilled = i < Math.floor(hotel.rating!);
                              const isHalf = i === Math.floor(hotel.rating!) && hotel.rating! % 1 >= 0.5;
                              return (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    isFilled || isHalf 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
                          <Badge className={`ml-2 ${getRatingBadgeStyle(hotel.rating)}`}>
                            {getRatingLabel(hotel.rating)}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Reviews Section */}
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-600">Reviews</div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {hotel.phrases && hotel.phrases.length > 0 
                            ? hotel.phrases.join(', ')
                            : 'Premium accommodation with excellent amenities'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiences Section - EXACT COPY */}
          {safeData.experiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-orange-600 rounded" />
                Experiences & Activities
              </h3>
              <div className="space-y-4 pl-4">
                {safeData.experiences.slice(0, 4).map((experience, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                        <StaticImage 
                          src={experience.image || previewImages.experiences[index] || `https://picsum.photos/800/600?random=${index + 1}`}
                          alt={experience.name}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 mb-1">{experience.name}</div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">(4.8/5)</span>
                      </div>
                      <div className="text-sm text-gray-600">Unforgettable experience awaits</div>
                    </div>
                  </div>
                ))}
                {safeData.experiences.length > 4 && (
                  <div className="text-sm text-gray-500 pl-4 italic">
                    + {safeData.experiences.length - 4} more experiences included
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Day-wise Itinerary - EXACT COPY */}
          {safeData.dayWiseItinerary.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-purple-600 rounded" />
                Daily Itinerary
              </h3>
              <div className="space-y-6 pl-4">
                {safeData.dayWiseItinerary.slice(0, 4).map((day, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        {index < safeData.dayWiseItinerary.slice(0, 4).length - 1 && (
                          <div className="w-0.5 h-20 bg-purple-200 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-6">
                        <div className="text-base font-medium text-gray-900 mb-2">Day {day.day}: {day.title}</div>
                        
                        <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                            <StaticImage 
                              src={day.image || previewImages.days[index] || `https://picsum.photos/800/600?random=${index + 1}`}
                              alt={`Day ${day.day}`}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {day.content.length > 120 ? `${day.content.slice(0, 120)}...` : day.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {safeData.dayWiseItinerary.length > 4 && (
                  <div className="text-sm text-gray-500 pl-12 italic">
                    + {safeData.dayWiseItinerary.length - 4} more days in your complete itinerary
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destination Gallery - EXACT COPY */}
          {((safeData.destinationGallery && safeData.destinationGallery.length > 0) || safeData.destination) && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-teal-600 rounded" />
                Destination Gallery
              </h3>
              <div className="grid grid-cols-3 gap-3 pl-4">
                {safeData.destinationGallery && safeData.destinationGallery.length > 0 ? (
                  safeData.destinationGallery.slice(0, 6).map((galleryItem, index) => (
                    <div key={index} className="relative group">
                      <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={getProxiedImageUrl(galleryItem.image || `https://picsum.photos/300/200?random=${5000 + index}`)}
                          alt={galleryItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <div className="text-white text-xs font-medium mb-1 leading-tight">{galleryItem.name}</div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            galleryItem.type === 'city' ? 'bg-blue-500/90 text-blue-100' :
                            galleryItem.type === 'activity' ? 'bg-green-500/90 text-green-100' :
                            'bg-purple-500/90 text-purple-100'
                          }`}>
                            {galleryItem.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : safeData.destination && (
                  // Show default destination images when no gallery items are set
                  Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="relative">
                      <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={getProxiedImageUrl(`https://picsum.photos/300/200?random=${5000 + index}`)}
                          alt={`${safeData.destination} highlight ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <div className="text-white text-xs font-medium">{safeData.destination}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
                              {safeData.destinationGallery && safeData.destinationGallery.length > 6 && (
                  <div className="text-sm text-gray-500 pl-4 italic">
                    + {safeData.destinationGallery.length - 6} more gallery items
                </div>
              )}
            </div>
          )}

          {/* Practical Information - EXACT COPY */}
          {(safeData.practicalInfo.visa || safeData.practicalInfo.currency || safeData.practicalInfo.tips.length > 0) && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-blue-600 rounded" />
                Practical Information
              </h3>
              <div className="space-y-3 text-sm pl-4">
                {safeData.practicalInfo.visa && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <strong className="text-blue-900">Visa Requirements:</strong>
                    <div className="text-blue-800 mt-1">{safeData.practicalInfo.visa}</div>
                  </div>
                )}
                {safeData.practicalInfo.currency && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <strong className="text-green-900">Currency:</strong>
                    <div className="text-green-800 mt-1">{safeData.practicalInfo.currency}</div>
                  </div>
                )}
                {safeData.practicalInfo.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <strong className="text-amber-900">Travel Tips:</strong>
                    <ul className="list-disc list-inside text-amber-800 mt-2 space-y-1">
                      {safeData.practicalInfo.tips.slice(0, 3).map((tip, index) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Optional Sections - EXACT COPY */}
          {(safeData.withKids || safeData.withFamily || safeData.offbeatSuggestions) && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-indigo-600 rounded" />
                Special Recommendations
              </h3>
              <div className="space-y-3 pl-4">
                {safeData.withKids && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <UsersIcon />
                    <div>
                      <div className="font-medium text-blue-900">Family with Kids</div>
                      <div className="text-sm text-blue-800 mt-1">Special activities and recommendations for families traveling with children</div>
                    </div>
                  </div>
                )}
                {safeData.withFamily && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <HeartIcon />
                    <div>
                      <div className="font-medium text-red-900">Family-Friendly Options</div>
                      <div className="text-sm text-red-800 mt-1">Carefully curated family-friendly activities and dining options</div>
                    </div>
                  </div>
                )}
                {safeData.offbeatSuggestions && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CompassIcon />
                    <div>
                      <div className="font-medium text-green-900">Offbeat Discoveries</div>
                      <div className="text-sm text-green-800 mt-1">Hidden gems and unique experiences off the beaten path</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State - EXACT COPY */}
          {!safeData.title && !safeData.destination && safeData.hotels.length === 0 && safeData.experiences.length === 0 && safeData.dayWiseItinerary.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CameraIcon />
              <p className="text-lg font-medium mb-2">Your PDF preview will appear here</p>
              <p className="text-sm opacity-75">Start filling the form to see your beautiful travel itinerary come to life</p>
            </div>
          )}
        </div>

        {/* Footer - EXACT COPY */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Generated by PickMyPDF</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
