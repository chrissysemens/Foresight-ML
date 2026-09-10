import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [
    "@predict-flow/core",
    "@tensorflow/tfjs-node",
    "@mapbox/node-pre-gyp",
    "aws-sdk",
    "mock-aws-s3",
    "nock"
  ]
});