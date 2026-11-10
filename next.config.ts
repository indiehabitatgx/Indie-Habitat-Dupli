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
    // Serve images as-is. Every site image is already a compressed WebP (all of /public/images is ~2 MB), and
    // Vercel's Hobby plan caps image optimizations — when the cap is hit every <Image> fails with 402.
    unoptimized: true,
    qualities: [60, 75, 85, 90],
    // Live Instagram feed images (official API media URLs), proxied and cached by next/image.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  // Link-preview images (app/**/opengraph-image.tsx) read these at runtime on serverless hosts.
  outputFileTracingIncludes: {
    "/**": [
      "./assets/og/**/*",
      "./public/images/hero/*.webp",
      "./public/images/brand/*.png",
      "./public/images/events/*.webp",
      "./public/images/events/bms/*.webp",
      "./public/images/venue/*.webp",
      "./public/images/gallery/*.webp",
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
