import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:single` makes one self-contained index.html (used for preview links).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "single" ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 1500, ...(mode === "single" ? { outDir: "dist-single" } : {}) },
}));
