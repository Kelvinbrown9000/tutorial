/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for builds (use webpack) until native SWC binaries are installed
  experimental: {},

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, nosnippet, noarchive, noimageindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
