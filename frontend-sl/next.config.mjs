/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "backend.bonikbook.com",
      "127.0.0.1",
      "randomuser.me",
    ], // Added randomuser.me
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.bonikbook.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      }, // Added for dummy avatars
    ],
  },
};

export default nextConfig;
