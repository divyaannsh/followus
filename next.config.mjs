/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['thumbs.dreamstime.com','sociapadash.s3.ap-south-1.amazonaws.com'], // ✅ Add your image domain here
  },
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
};

export default nextConfig;
