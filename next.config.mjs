/** @type {import('next').NextConfig} */

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

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ncsiapi.smsoman.com',
        port: '',
        pathname: '/uploads/newsimgs/**',
      },
      {
        protocol: 'https',
        hostname: 'ncsiapi.smsoman.com',
        port: '',
        pathname: '/uploads/achimgs/**', 
      },
      {
        protocol: 'https',
        hostname: 'ncsiapi.smsoman.com',
        port: '',
        pathname: '/uploads/orgimgs/**', 
      },
      {
        protocol: 'https',
        hostname: 'ncsiapi.smsoman.com',
        port: '',
        pathname: '/uploads/mediapdfs/**', 
      },
    ],
  },
};

export default nextConfig;
