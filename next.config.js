/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/spotify-APIs' : '',
  images: {
    unoptimized: true,
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'lineup-images.scdn.co'],
  },
}

module.exports = nextConfig
