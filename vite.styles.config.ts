import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist/lib',
    emptyOutDir: false,
    cssCodeSplit: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/styles/index.css'),
      output: {
        assetFileNames: 'styles[extname]',
      },
    },
  },
});
