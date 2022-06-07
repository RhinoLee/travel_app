import { fileURLToPath, URL } from 'url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
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
          injectScript: `
            <script async defer src="https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLEMAP_APIKEY}&libraries=geometry,places"></script>
          `,
        }
      }
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
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
