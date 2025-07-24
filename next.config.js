/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['localhost', 'images.unsplash.com', 'cdn.meddefi.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size for client
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
      }
    }

    // Improve module resolution for Netlify compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }

    // Enable bundle analysis in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      )
    }

    return config
  },

  // Experimental features for better performance
  experimental: {
    // Enable modern bundling
    esmExternals: true,
    // Improve tree shaking
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
}

module.exports = nextConfig 