import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: { alias: { '~@dns-modules': fileURLToPath(new URL('./node_modules/@dns-modules', import.meta.url)) } },
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'legacy-js-api'] } } },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  }
})
