/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['@clerk/nextjs'],
  },
}

// Use ES Module export syntax instead of CommonJS
export default nextConfig