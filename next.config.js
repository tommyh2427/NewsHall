/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
  },
};

module.exports = nextConfig;
