/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  serverExternalPackages: [],
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Enable Progressive Web App features
  poweredByHeader: false, // Remove X-Powered-By header
  // Disable certain HTTP features for better security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  // Next.js 15 settings
  // Allow cross-origin requests in development (for Replit)
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  // Configure allowed development origins for Replit
  allowedDevOrigins: [
    /\.replit\.dev$/,
    /\.pike\.replit\.dev$/
  ],
};

export default nextConfig;