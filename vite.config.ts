import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 确定路径重命名
const pathSrc = path.resolve(__dirname, 'src');
const typingSrc = path.resolve(__dirname, 'types')
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${typingSrc}`,
      '@/': `${pathSrc}`,
    }
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
