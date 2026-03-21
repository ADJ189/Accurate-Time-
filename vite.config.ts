import { defineConfig } from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: './',
  plugins: [cloudflare()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, passes: 2 },
      mangle: { toplevel: true },
    },
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
});