/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now stable in Next.js 13.4+ and no longer needed
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:path*.mdx',
        destination: '/api/mdx/:path*',
      },
    ];
  },
};

module.exports = nextConfig;