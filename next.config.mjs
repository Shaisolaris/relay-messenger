/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/relay-messenger',
  assetPrefix: '/relay-messenger/',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
}
export default nextConfig
