/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable server components
    serverActions: true,
  },
  // Configure path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './app',
      '@shared': './shared',
      '@assets': './attached_assets',
    };
    return config;
  },
};

export default nextConfig;