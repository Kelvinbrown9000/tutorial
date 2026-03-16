/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for builds (use webpack) until native SWC binaries are installed
  experimental: {},
};

export default nextConfig;
