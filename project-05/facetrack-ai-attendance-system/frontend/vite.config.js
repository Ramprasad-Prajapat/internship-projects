import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// FaceTrack AI — Vite config (Phase 1).
// The React plugin enables JSX transform + Fast Refresh.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
