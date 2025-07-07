import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; 
import autoprefixer from 'autoprefixer'; 

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
