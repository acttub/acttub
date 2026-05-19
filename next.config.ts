import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/^\/+|\/+$/g, "");

const nextConfig: NextConfig = {
  basePath: rawBasePath ? `/${rawBasePath}` : undefined,
};

export default nextConfig;
