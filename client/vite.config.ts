import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
      '.replit.dev',
      '.repl.co',
      /^.*\.riker\.replit\.dev$/,
      /^.*\.pike\.replit\.dev$/,
      /^.*\.spock\.replit\.dev$/,
      /^.*\.picard\.replit\.dev$/,
      /^.*\.replit\.app$/
    ],
    hmr: {
      port: 3000,
      host: '0.0.0.0'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})