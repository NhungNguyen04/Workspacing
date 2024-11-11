/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['@clerk/nextjs'], // Update this line
  },
  // ... any other configurations you might have
}

module.exports = nextConfig