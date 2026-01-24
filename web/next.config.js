/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8096/api/v1',
  },

  // 图片域名白名单配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'passport.bilibili.com',
        pathname: '/x/passport-tv-login/h5/qrcode/auth/**',
      },
    ],
  },
}

module.exports = nextConfig