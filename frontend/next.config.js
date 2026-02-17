/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // Configure Turbopack (Next.js 16+)
  turbopack: {
    // use absolute path to avoid turbopack root inference
    root: path.resolve(__dirname),
  },

  // (No custom webpackDevMiddleware here — keep config compatible with Turbopack)

  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;