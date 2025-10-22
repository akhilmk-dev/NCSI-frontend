/** @type {import('next').NextConfig} */

// next.config.mjs
import i18n from './next-i18next.config.js';

const nextConfig = {
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/:locale/api/:path*',
        destination: '/api/:path*', // Remove locale from API calls
      },
    ];
  },
};

export default nextConfig;

