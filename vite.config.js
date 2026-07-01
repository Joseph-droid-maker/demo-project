import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite + React config. No proxy needed — this demo has no backend
// to proxy to; all "API" calls are simulated in-memory (see src/data/).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
