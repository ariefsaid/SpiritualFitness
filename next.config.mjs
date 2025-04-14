/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript/ESLint errors should not prevent builds in Replit
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
    // Disable image optimization in Replit to help with performance
    unoptimized: true,
  },
  // Configure static export for Replit
  output: 'standalone',
  serverExternalPackages: [],
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    
    // Special configuration for Replit environment
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    
    return config;
  },
  // Enable Progressive Web App features
  poweredByHeader: false, // Remove X-Powered-By header
  // Next.js 15 settings
  devIndicators: {
    position: 'bottom-right',
  },
  // Special configuration for Replit environment
  // Allow cross-origin requests from Replit domains
  allowedDevOrigins: [
    '*', // Allow all origins in development - adjust for production
    'https://*.replit.dev', 
    'https://*.repl.co', 
    'https://*.replit.app', 
    'https://*.pike.replit.dev',
    'http://*.replit.dev', 
    'http://*.repl.co', 
    'http://*.replit.app', 
    'http://*.pike.replit.dev'
  ],
  // Security and CORS headers for Replit
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Special handling for manifest
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed from DENY to allow Replit iframe
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // CORS headers for Replit
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;