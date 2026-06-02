import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/painel/',
  // dev-only: permite preview via túnel (ngrok); ignorado no build de produção
  server: { allowedHosts: true, host: true },
  plugins: [react()],
  resolve: {
    alias: {
      '@fenice/shared': fileURLToPath(
        new URL('../../shared/src', import.meta.url)
      ),
    },
  },
});
