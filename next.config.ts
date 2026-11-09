import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 90],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Live Instagram feed images (official API media URLs), proxied and cached by next/image.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Preserve SEO equity from the original WordPress URLs.
  async redirects() {
    return [
      { source: "/the-habitat", destination: "/venue/the-habitat", permanent: true },
      { source: "/above-the-habitat", destination: "/venue/above-the-habitat", permanent: true },
      { source: "/jam-room", destination: "/venue/jam-room", permanent: true },
      { source: "/banquets-conferences", destination: "/corporate-events", permanent: true },
      { source: "/cancellation-policy", destination: "/refund-policy", permanent: true },
    ];
  },
};

export default nextConfig;
