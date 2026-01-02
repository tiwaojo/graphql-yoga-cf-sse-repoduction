import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    name: "framezee-api-tests",
    testTimeout: 120000, // 120 seconds
    poolOptions: {
      workers: {
        wrangler: {
          configPath: "./wrangler.toml",
          // environment: 'development'
        },
        miniflare: {
          compatibilityFlags: ["nodejs_compat"],
        },
      },
    },
  },
});
