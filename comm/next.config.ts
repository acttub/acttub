import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/community",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
};

export default nextConfig;
