import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
