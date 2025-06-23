import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 4000, // 👈 Change ici le port par défaut
    strictPort: true, // 👈 (Optionnel) Évite qu’il tente un autre port s’il est déjà utilisé
  },
});
