/** @type {import('next').NextConfig} */



const nextConfig = {
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },

  async rewrites() {
    return [
      {
        source: '/:locale/api/:path*',
        destination: '/api/:path*', 
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
