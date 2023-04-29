import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 确定路径重命名
const pathSrc = path.resolve(__dirname, 'src');
const typingSrc = path.resolve(__dirname, 'types')
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '~/': `${typingSrc}/`,
      '@/': `${pathSrc}/`,
    }
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    hmr: { overlay: false },
    host: '0.0.0.0',
    port: 8082,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://120.26.125.147:8081/back',
        changeOrigin: true,
        rewrite: (path: string): string => path.replace(/^\/api/, ''),
      },
    },
  },
})
