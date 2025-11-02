/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  typescript: {
    // Ignore build errors during development
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors
    ignoreDuringBuilds: false,
  },
  // Optimize images and other assets
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Required for static export
  },
  // Enable compression
  compress: true,
  // Environment variables
  env: {
    CUSTOM_KEY: 'tron-ultimate-ai-platform',
  },
  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  poweredByHeader: false,
  swcMinify: true,
}

module.exports = nextConfig