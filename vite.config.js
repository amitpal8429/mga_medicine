import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /api/* is proxied to the Academy server so the browser never hits a CORS wall.
// In production the same rewrite lives in vercel.json (Vercel) or public/_redirects (Netlify).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://24x7.medicalglobalacademy.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: { environment: 'node' },
});
