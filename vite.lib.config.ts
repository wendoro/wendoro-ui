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
        charts: path.resolve(__dirname, 'src/components/charts/index.ts'),
        'charts-advanced': path.resolve(__dirname, 'src/components/charts/advanced/index.ts'),
        business: path.resolve(__dirname, 'src/components/business/index.ts'),
        hooks: path.resolve(__dirname, 'src/hooks/index.ts'),
      },
      name: 'WendoroUI',
      formats: ['es', 'cjs'],
      cssFileName: 'styles',
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        if (entryName === 'tokens') return `tokens/index.${ext}`;
        if (entryName === 'charts') return `charts/index.${ext}`;
        if (entryName === 'charts-advanced') return `charts/advanced/index.${ext}`;
        if (entryName === 'business') return `business/index.${ext}`;
        if (entryName === 'hooks') return `hooks/index.${ext}`;
        return `wendoro-ui.${ext}`;
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
