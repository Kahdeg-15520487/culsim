import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'github' ? '/culsim/' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    open: true
  }
}));