import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/images/hero-2.webp", search: "?v=3" },
      { pathname: "/images/hero-2-mobile.webp", search: "?v=3" },
      { pathname: "/images/j-food-2.webp", search: "?v=2" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default config;
