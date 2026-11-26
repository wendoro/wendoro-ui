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
        ai: path.resolve(__dirname, 'src/components/ai/index.ts'),
        editors: path.resolve(__dirname, 'src/components/editors/index.ts'),
        adapters: path.resolve(__dirname, 'src/components/adapters/index.ts'),
        core: path.resolve(__dirname, 'src/subpaths/core.ts'),
        forms: path.resolve(__dirname, 'src/subpaths/forms.ts'),
        navigation: path.resolve(__dirname, 'src/subpaths/navigation.ts'),
        data: path.resolve(__dirname, 'src/subpaths/data.ts'),
        editor: path.resolve(__dirname, 'src/subpaths/editor.ts'),
        workspace: path.resolve(__dirname, 'src/subpaths/workspace.ts'),
        commerce: path.resolve(__dirname, 'src/subpaths/commerce.ts'),
        admin: path.resolve(__dirname, 'src/subpaths/admin.ts'),
        industry: path.resolve(__dirname, 'src/subpaths/industry.ts'),
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
        if (entryName === 'ai') return `ai/index.${ext}`;
        if (entryName === 'editors') return `editors/index.${ext}`;
        if (entryName === 'adapters') return `adapters/index.${ext}`;
        if (entryName === 'core') return `core/index.${ext}`;
        if (entryName === 'forms') return `forms/index.${ext}`;
        if (entryName === 'navigation') return `navigation/index.${ext}`;
        if (entryName === 'data') return `data/index.${ext}`;
        if (entryName === 'editor') return `editor/index.${ext}`;
        if (entryName === 'workspace') return `workspace/index.${ext}`;
        if (entryName === 'commerce') return `commerce/index.${ext}`;
        if (entryName === 'admin') return `admin/index.${ext}`;
        if (entryName === 'industry') return `industry/index.${ext}`;
        return `wendoro-ui.${ext}`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'lucide-react'],
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
