import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv, mode } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'

const env = loadEnv(mode, process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          // <script async defer src="https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLEMAP_APIKEY}"></script>
          injectScript: `
            <script async src="https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLEMAP_APIKEY}&libraries=places"></script>
          `,
        }
      }
    })
  ],
  server: {
    port: 3003
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
