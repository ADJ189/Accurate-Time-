import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  publicDir: 'public',
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
