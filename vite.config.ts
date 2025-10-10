import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Age-of-Survival/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
