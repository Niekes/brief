import path from "path";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: 3000 },
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react", "import", "jsx-a11y"],
    categories: { correctness: "error" },
    options: {
      denyWarnings: true,
      reportUnusedDisableDirectives: "error",
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: ["src/components/ui/**"],
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-floating-promises": "error",
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "error",
    },
  },
});
