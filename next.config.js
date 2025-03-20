/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Remove experimental.serverActions as it's now enabled by default
  experimental: {
    serverComponentsExternalPackages: ['googleapis'],
  },
}

module.exports = nextConfig
