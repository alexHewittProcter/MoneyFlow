const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  assetPrefix: isProd ? "/money-flow" : undefined,
  basePath: isProd ? "/money-flow" : undefined,
};

module.exports = nextConfig;
