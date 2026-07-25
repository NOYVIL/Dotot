import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub project pages are served from https://<user>.github.io/Dotot/
  base: '/Dotot/',
  plugins: [react(), tailwindcss()],
});
