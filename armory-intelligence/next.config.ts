import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run ESLint separately via `npm run lint` (avoids deprecated next lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during build (run separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Stub optional peer deps from @standard-community/standard-json
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };

    // Fix chevrotain's lodash-es import issues
    // Use exact-match alias ($) so lodash-es/min.js etc. still resolve from node_modules
    config.resolve.alias["lodash-es$"] = require.resolve("lodash-es");

    // Fix EISDIR readlink bug on Windows + Node.js 22
    // Disable symlink resolution since we don't use symlinks
    config.resolve.symlinks = false;

    // Ensure .js extensions resolve correctly for ESM packages
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    // Disable persistent filesystem cache to avoid readlink EISDIR
    config.cache = false;

    return config;
  },
};

export default nextConfig;
