/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for serverless optimization
  experimental: {
    // Enable server components optimization
    serverComponentsExternalPackages: ['puppeteer'],
  },
  
  // Configure external packages for serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle puppeteer for client-side
      config.externals.push('puppeteer');
    }
    return config;
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
