"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { FileText, MapPin, Star, Download, Plus } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard')}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({ 
          title: "Sign In Error", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-black" />
              <span className="ml-2 text-xl font-bold text-black">PickMyPDF</span>
            </div>
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="bg-black hover:bg-gray-800 text-white px-6"
            >
              {isLoading ? (
                <Icons.loaderCircle className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icons.google className="w-4 h-4 mr-2" />
              )}
              Google Signin
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-6">
            Welcome to<br />
            <span className="text-black">PickMyPDF</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your travel documents into beautiful, professional itineraries 
            with AI-powered extraction and generation.
          </p>
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg"
          >
            {isLoading ? (
              <Icons.loaderCircle className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Icons.google className="w-5 h-5 mr-2" />
            )}
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            Features that make travel planning effortless
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">PDF Extraction</h3>
              <p className="text-gray-600">
                Extract travel information from any PDF document with AI precision
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Smart Itineraries</h3>
              <p className="text-gray-600">
                Generate beautiful travel itineraries automatically from your documents
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Export & Share</h3>
              <p className="text-gray-600">
                Download professional PDFs ready to share with clients and companions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to transform your travel planning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who trust PickMyPDF for professional travel itineraries
          </p>
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg"
          >
            {isLoading ? (
              <Icons.loaderCircle className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Icons.google className="w-5 h-5 mr-2" />
            )}
            Start Creating Now
          </Button>
        </div>
      </div>
    </div>
  );
}
