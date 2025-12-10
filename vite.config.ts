import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Age-of-Survival/' : '/',
  build: {
    outDir: 'docs'
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  }
}));
