/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
};

module.exports = nextConfig;
