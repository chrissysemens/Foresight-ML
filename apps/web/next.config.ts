import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  turbopack: {
    root: "../../",
  },

  serverExternalPackages: [
    "@predict-flow/ml",
    "@tensorflow/tfjs-node",
    "@mapbox/node-pre-gyp",
  ],
};

export default nextConfig;