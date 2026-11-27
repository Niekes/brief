import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.*",
        "**/*.d.ts",
        "src/components/ui/**",
        "src/components/pdf/**",
        "src/lib/pdf-primitives.tsx",
        "src/lib/pdf-svg.tsx",
        "src/lib/resolve-color.ts",
        "src/lib/pdf-themes/**",
        "src/main.tsx",
      ],
      thresholds: { 100: true },
    },
  },
});
