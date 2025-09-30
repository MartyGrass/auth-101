/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true, // 308
      },
    ];
  },
};

module.exports = nextConfig;
