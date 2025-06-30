/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
  },
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during production builds for better performance
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;