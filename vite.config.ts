import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时使用仓库名作为 base
  // 如果是根域名部署，移除 base 或设为 '/'
  base: '/828-internet-memory/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
