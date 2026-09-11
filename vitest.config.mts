import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/*
  Vitest setup, following the Next 16 guide in
  node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md.

  That guide still installs `vite-tsconfig-paths` for the `@/` alias; this
  Vite resolves tsconfig paths natively and says so on startup, so the plugin
  is gone and the native option does the same job.

  Known limit, straight from the same guide: Vitest cannot render async Server
  Components. `cart-data.tsx` is one, so its mapping is covered through the
  view model it produces rather than by rendering it — an end-to-end test is
  the right tool for that component.
*/
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
