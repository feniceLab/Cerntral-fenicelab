import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/trafego/',
  plugins: [react()],
  resolve: {
    alias: {
      '@fenice/shared': fileURLToPath(
        new URL('../../shared/src', import.meta.url)
      ),
    },
  },
});
