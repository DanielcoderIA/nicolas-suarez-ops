import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/reservas",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/reservas",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
