import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@noterama/core"],
  turbopack: {
    root: "../../",
  },
};

export default nextConfig;
