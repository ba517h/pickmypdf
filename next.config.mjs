/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalize packages for serverless deployment
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  
  // Experimental features for serverless optimization
  experimental: {
    // Enable server components optimization
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core', '@sparticuz/chromium'],
  },
  
  // Configure external packages for serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle puppeteer packages for server-side
      config.externals.push('puppeteer', 'puppeteer-core', '@sparticuz/chromium');
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
