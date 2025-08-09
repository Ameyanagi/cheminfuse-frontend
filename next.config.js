/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/1',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
