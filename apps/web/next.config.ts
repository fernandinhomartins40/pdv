import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pdv/ui", "@pdv/types"]
};

export default nextConfig;
