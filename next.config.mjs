/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    NEXT_PUBLIC_STABILITY_API_KEY: process.env.NEXT_PUBLIC_STABILITY_API_KEY,
  },
  compiler: {
    // Remove console.log in production builds only
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["blob.v0.dev"],
    unoptimized: true,
  },
};

export default nextConfig;
