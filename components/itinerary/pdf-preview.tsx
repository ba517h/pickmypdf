import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { usePreviewImages, PreviewImages } from "@/hooks/use-preview-images";

interface PdfPreviewProps {
  data: ItineraryFormData;
  onImagesLoaded?: (images: PreviewImages) => void;
}

export function PdfPreview({ data, onImagesLoaded }: PdfPreviewProps) {
  const { previewImages } = usePreviewImages(data);

  // Notify parent when images are loaded
  React.useEffect(() => {
    if (onImagesLoaded && (previewImages.main || previewImages.hotels.length > 0)) {
      onImagesLoaded(previewImages);
    }
  }, [previewImages, onImagesLoaded]);

  return (
    <Card className="h-fit overflow-hidden border-0 shadow-none font-manrope w-full">
      {/* Header Section with Background Image - Cover Page */}
      <div id="pdf-cover" className="relative pt-12 pb-12 px-0 text-white overflow-hidden flex flex-col justify-between min-h-[320px] scroll-mt-4">
        {/* Background Image */}
        {(data.mainImage || previewImages.main || data.destination) && (
          <>
            <div className="absolute inset-0">
              <img 
                src={`https://images.weserv.nl/?url=${encodeURIComponent(data.mainImage || previewImages.main || `https://picsum.photos/800/400?random=1`)}&w=420&output=jpg&q=75`} 
                alt="Header background" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/800/400?random=${Date.now()}`)}&w=420&output=jpg&q=75`;
                }}
              />
            </div>
            {/* Gradient Overlays for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-blue-800/70 to-blue-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </>
        )}
        
        {/* Fallback solid background if no image */}
        {!previewImages.main && !data.destination && (
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
            
            {data.title ? (
              <h1 className="text-3xl font-bold mb-6 leading-tight drop-shadow-md max-w-sm mx-auto">{data.title}</h1>
            ) : (
              <h1 className="text-3xl font-bold mb-6 leading-tight opacity-80 drop-shadow-md max-w-sm mx-auto">Your Travel Itinerary</h1>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 text-base mb-6">
              {data.destination && (
                <div className="flex items-center gap-1 drop-shadow-sm">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{data.destination}</span>
                </div>
              )}
              {data.duration && (
                <div className="flex items-center gap-1 drop-shadow-sm">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{data.duration}</span>
                </div>
              )}
            </div>

            {/* Cost in INR Block */}
            <div className="mb-6">
              <div className="inline-block bg-white/25 backdrop-blur-sm text-white rounded-full px-4 py-2 font-semibold text-base drop-shadow-md">
                ₹{data.costInINR || "1,42,000/pax"}
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Tags */}
          <div className="flex justify-center pb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {(() => {
                const defaultTags = ["Adventure", "Cultural", "Photography", "Foodie"];
                const displayTags = data.tags.length > 0 ? data.tags : defaultTags;
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

      <CardContent className="p-0">
        <div className="p-6 space-y-8">
          {/* Overview Section */}
          <div id="pdf-overview" className="space-y-4 scroll-mt-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
              <div className="w-1 h-6 bg-blue-600 rounded" />
              Overview
            </h3>
            <div className="space-y-4 pl-4">
              {data.summary && (
                <div className="text-gray-700 leading-relaxed">
                  {data.summary}
                </div>
              )}
              {data.routing && (
                <div className="text-gray-700 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Routing:</strong> {data.routing}
                  </div>
                </div>
              )}

              {!data.summary && !data.routing && (
                <div className="text-gray-500 italic">
                  Trip overview not added yet.
                </div>
              )}
            </div>
          </div>

          {/* Hotels Section */}
          {data.hotels.length > 0 && (
            <div id="pdf-accommodations" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-green-600 rounded" />
                Accommodations
              </h3>
              <div className="space-y-4 pl-4">
                {data.hotels.slice(0, 3).map((hotel, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="h-24 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={`https://images.weserv.nl/?url=${encodeURIComponent(previewImages.hotels[index] || `https://picsum.photos/400/150?random=${2000 + index}`)}&w=420&output=jpg&q=75`}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/400/150?random=${Date.now() + index}`)}&w=420&output=jpg&q=75`;
                        }}
                      />
                    </div>
                    <div className="text-base font-medium text-gray-900">{hotel.name}</div>
                    <div className="text-sm text-gray-600 mt-1">Premium accommodation</div>
                  </div>
                ))}
                {data.hotels.length > 3 && (
                  <div className="text-sm text-gray-500 pl-4 italic">
                    + {data.hotels.length - 3} more accommodations included
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experiences Section */}
          {data.experiences.length > 0 && (
            <div id="pdf-experiences" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-orange-600 rounded" />
                Experiences & Activities
              </h3>
              <div className="space-y-4 pl-4">
                {data.experiences.slice(0, 4).map((experience, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://images.weserv.nl/?url=${encodeURIComponent(previewImages.experiences[index] || `https://picsum.photos/120/120?random=${3000 + index}`)}&w=420&output=jpg&q=75`}
                        alt={experience.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/120/120?random=${Date.now() + index}`)}&w=420&output=jpg&q=75`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 mb-1">{experience.name}</div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">(4.8/5)</span>
                      </div>
                      <div className="text-sm text-gray-600">Unforgettable experience awaits</div>
                    </div>
                  </div>
                ))}
                {data.experiences.length > 4 && (
                  <div className="text-sm text-gray-500 pl-4 italic">
                    + {data.experiences.length - 4} more experiences included
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Day-wise Itinerary */}
          {data.dayWiseItinerary.length > 0 && (
            <div id="pdf-daywise" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-purple-600 rounded" />
                Daily Itinerary
              </h3>
              <div className="space-y-6 pl-4">
                {data.dayWiseItinerary.slice(0, 4).map((day, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        {index < data.dayWiseItinerary.slice(0, 4).length - 1 && (
                          <div className="w-0.5 h-20 bg-purple-200 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-6">
                        <div className="text-base font-medium text-gray-900 mb-2">Day {day.day}: {day.title}</div>
                        
                        <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          <img 
                            src={`https://images.weserv.nl/?url=${encodeURIComponent(previewImages.days[index] || `https://picsum.photos/500/200?random=${4000 + index}`)}&w=420&output=jpg&q=75`}
                            alt={`Day ${day.day}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/500/200?random=${Date.now() + index}`)}&w=420&output=jpg&q=75`;
                            }}
                          />
                        </div>
                        
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {day.content.length > 120 ? `${day.content.slice(0, 120)}...` : day.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {data.dayWiseItinerary.length > 4 && (
                  <div className="text-sm text-gray-500 pl-12 italic">
                    + {data.dayWiseItinerary.length - 4} more days in your complete itinerary
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destination Gallery */}
          {((data.destinationGallery && data.destinationGallery.length > 0) || data.destination) && (
            <div id="pdf-gallery" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-teal-600 rounded" />
                Destination Gallery
              </h3>
              <div className="grid grid-cols-3 gap-3 pl-4">
                {data.destinationGallery && data.destinationGallery.length > 0 ? (
                  data.destinationGallery.slice(0, 6).map((galleryItem, index) => (
                    <div key={index} className="relative group">
                      <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={`https://images.weserv.nl/?url=${encodeURIComponent(galleryItem.image || `https://picsum.photos/300/200?random=${5000 + index}`)}&w=420&output=jpg&q=75`}
                          alt={galleryItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/300/200?random=${Date.now() + index}`)}&w=420&output=jpg&q=75`;
                          }}
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
                ) : data.destination && (
                  // Show default destination images when no gallery items are set
                  Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="relative">
                      <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://picsum.photos/300/200?random=${5000 + index}`)}&w=420&output=jpg&q=75`}
                          alt={`${data.destination} highlight ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <div className="text-white text-xs font-medium">{data.destination}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {data.destinationGallery && data.destinationGallery.length > 6 && (
                <div className="text-sm text-gray-500 pl-4 italic">
                  + {data.destinationGallery.length - 6} more gallery items
                </div>
              )}
            </div>
          )}

          {/* Practical Information */}
          {(data.practicalInfo.visa || data.practicalInfo.currency || data.practicalInfo.tips.length > 0) && (
            <div id="pdf-practical" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-blue-600 rounded" />
                Practical Information
              </h3>
              <div className="space-y-3 text-sm pl-4">
                {data.practicalInfo.visa && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <strong className="text-blue-900">Visa Requirements:</strong>
                    <div className="text-blue-800 mt-1">{data.practicalInfo.visa}</div>
                  </div>
                )}
                {data.practicalInfo.currency && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <strong className="text-green-900">Currency:</strong>
                    <div className="text-green-800 mt-1">{data.practicalInfo.currency}</div>
                  </div>
                )}
                {data.practicalInfo.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <strong className="text-amber-900">Travel Tips:</strong>
                    <ul className="list-disc list-inside text-amber-800 mt-2 space-y-1">
                      {data.practicalInfo.tips.slice(0, 3).map((tip, index) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Optional Sections */}
          {(data.withKids || data.withFamily || data.offbeatSuggestions) && (
            <div id="pdf-optional" className="space-y-4 scroll-mt-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="w-1 h-6 bg-indigo-600 rounded" />
                Special Recommendations
              </h3>
              <div className="space-y-3 pl-4">
                {data.withKids && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-900">Family with Kids</div>
                      <div className="text-sm text-blue-800 mt-1">Special activities and recommendations for families traveling with children</div>
                    </div>
                  </div>
                )}
                {data.withFamily && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-red-900">Family-Friendly Options</div>
                      <div className="text-sm text-red-800 mt-1">Carefully curated family-friendly activities and dining options</div>
                    </div>
                  </div>
                )}
                {data.offbeatSuggestions && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <Compass className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-900">Offbeat Discoveries</div>
                      <div className="text-sm text-green-800 mt-1">Hidden gems and unique experiences off the beaten path</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!data.title && !data.destination && data.hotels.length === 0 && data.experiences.length === 0 && data.dayWiseItinerary.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Your PDF preview will appear here</p>
              <p className="text-sm opacity-75">Start filling the form to see your beautiful travel itinerary come to life</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Generated by PickMyPDF</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}