export default {
  reactStrictMode: true,
  images: {
    domains: ['127.0.1.1'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/:path*'// Proxy to Backend
      }
    ];
  }
};
