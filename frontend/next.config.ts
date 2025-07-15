import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
      preventFullImport: true
    }
  },
  // You can add other Next.js config options here
};

export default nextConfig;
