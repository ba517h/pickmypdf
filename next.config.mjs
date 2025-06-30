/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for serverless optimization
  experimental: {
    // Enable server components optimization
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min'],
  },
  
  // Configure external packages for serverless
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Don't bundle puppeteer packages for server-side
      config.externals.push('puppeteer', 'puppeteer-core', '@sparticuz/chromium');
    }
    
    // Optimize webpack cache to handle large strings efficiently
    if (!dev) {
      // Use more efficient cache settings
      config.cache = {
        ...config.cache,
        type: 'filesystem',
        // Optimize cache compression for large strings
        compression: 'gzip',
      };
      
      // Optimize chunk splitting to prevent large bundles
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Split large schemas and types into separate chunks
            schemas: {
              name: 'schemas',
              test: /[\\/]lib[\\/](schemas|types)\.ts$/,
              chunks: 'all',
              priority: 10,
            },
            // Split PDF templates into separate chunks  
            pdfTemplates: {
              name: 'pdf-templates',
              test: /[\\/]pdf-mobile-template\.tsx$/,
              chunks: 'async',
              priority: 9,
            },
          },
        },
      };
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
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
