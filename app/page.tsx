"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { FileText, MapPin, Clock, Download, Sparkles, Globe, Check, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirectTo') || '/itinerary';
    
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });
    
    setIsLoading(false);
    
    if (error) {
      toast({ 
        title: "Sign In Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "PDF Extraction",
      description: "Extract text and data from any PDF document with AI-powered precision"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Smart Itineraries",
      description: "Generate beautiful travel itineraries from your documents automatically"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "What used to take hours now takes minutes with our intelligent processing"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Share",
      description: "Download professional PDFs ready to share with clients or travel companions"
    }
  ];

  const benefits = [
    "AI-powered document processing",
    "Beautiful, professional layouts",
    "Real-time collaboration",
    "Secure cloud storage",
    "Mobile-responsive design",
    "No technical skills required"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PickMyPDF
              </span>
            </div>
            <Button 
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Icons.loaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Icons.google className="w-4 h-4" />
              )}
              <span>Sign In</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered PDF Processing
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform PDFs
            </span>
            <br />
            <span className="text-gray-900">Into Beautiful</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Travel Itineraries
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Extract, process, and transform your travel documents into stunning, 
            professional itineraries in minutes. No design skills required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <Icons.loaderCircle className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Icons.google className="w-5 h-5 mr-2" />
              )}
              Get Started with Google
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500">
              Free to try • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing itineraries
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your travel planning effortless and professional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why thousands choose PickMyPDF
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Join travel professionals, agencies, and individuals who trust our platform 
                to create stunning itineraries that impress clients and make planning effortless.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-800" />
                    </div>
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-6 text-blue-200" />
                    <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                    <p className="text-blue-100 mb-6">
                      Transform your first document in under 2 minutes
                    </p>
                    <Button 
                      size="lg"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                    >
                      {isLoading ? (
                        <Icons.loaderCircle className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Icons.google className="w-5 h-5 mr-2" />
                      )}
                      Start Free Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PickMyPDF
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Transform your travel documents into beautiful itineraries
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                © 2024 PickMyPDF. Built with ❤️ for travelers worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
