/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable server actions
    serverActions: true,
  },
  // Configure path aliases (these should match tsconfig.json)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './app',
      '@/components': './app/components',
      '@/hooks': './app/hooks',
      '@/lib': './app/lib',
      '@shared': './shared',
      '@server': './server',
      '@assets': './attached_assets',
    };
    return config;
  },
  // Configure API proxy for development to use the existing Express server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  // PWA configuration
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  },
};

export default nextConfig;