import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@modelcontextprotocol/sdk'],
  },
  // MCP 관련 파일들을 트랜스파일에서 제외
  transpilePackages: [],
  // TypeScript 오류 무시 (임시)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
