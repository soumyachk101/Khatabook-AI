/** @type {import('next').NextConfig} */
const nextConfig = {
 // Transpile shared package for monorepo consumption
 transpilePackages: ['@khatabook/shared'],

 // Image optimization
 images: {
 remotePatterns: [
 {
 protocol: 'https',
 hostname: '**.supabase.co',
 },
 {
 protocol: 'https',
 hostname: 'storage.googleapis.com',
 },
 {
 protocol: 'https',
 hostname: 's3.amazonaws.com',
 },
 {
 protocol: 'https',
 hostname: '**.s3.amazonaws.com',
 },
 ],
 },

 // Environment variable validation (server-only)
 env: {
 CUSTOM_KEY: process.env.CUSTOM_KEY,
 },

 // Experimental features
 experimental: {
 serverActions: {
 bodySizeLimit: '2mb',
 },
 },
};

module.exports = nextConfig;
