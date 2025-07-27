import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
        postcss: {
          plugins: [tailwindcss],
        },
      },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
    hmr: {
      port: 24678,
      host: '0.0.0.0'
    },
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})