import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ACTI", destination: "https://acti-tau.vercel.app/ACTI" },
      { source: "/ACTI/:path*", destination: "https://acti-tau.vercel.app/ACTI/:path*" },
      { source: "/archive", destination: "https://acttub-archive.vercel.app/archive" },
      {
        source: "/archive/:path*",
        destination: "https://acttub-archive.vercel.app/archive/:path*",
      },
      { source: "/community", destination: "https://acttub-comm.vercel.app/community" },
      {
        source: "/community/:path*",
        destination: "https://acttub-comm.vercel.app/community/:path*",
      },
      { source: "/excer", destination: "https://acttub-excer.vercel.app/excer" },
      { source: "/excer/:path*", destination: "https://acttub-excer.vercel.app/excer/:path*" },
      { source: "/thea", destination: "https://thea-zeta.vercel.app/thea" },
      { source: "/thea/:path*", destination: "https://thea-zeta.vercel.app/thea/:path*" },
    ];
  },
};

export default nextConfig;
