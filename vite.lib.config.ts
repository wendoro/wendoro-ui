import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist/lib',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        tokens: path.resolve(__dirname, 'src/tokens/index.ts'),
      },
      name: 'WendoroUI',
      formats: ['es', 'cjs'],
      cssFileName: 'styles',
      fileName: (format, entryName) => {
        if (entryName === 'tokens') {
          return format === 'es' ? 'tokens/index.js' : 'tokens/index.cjs';
        }
        return format === 'es' ? 'wendoro-ui.js' : 'wendoro-ui.cjs';
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lucide-react': 'LucideReact',
        },
      },
    },
  },
});
