import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// В коде картинки из public/ указаны абсолютно ('/images/...'). На GitHub Pages сайт живет
// в подпапке (/dns-product-card/), поэтому при сборке делаем такие пути относительными.
const relativePublicPaths = () => ({
  name: 'relative-public-paths',
  apply: 'build',
  renderChunk: code => code.replace(/(["'`])\/(images|icons|home|premium)\//g, '$1./$2/'),
})

export default defineConfig({
  base: './',
  plugins: [vue(), relativePublicPaths()],
  resolve: { alias: { '~@dns-modules': fileURLToPath(new URL('./node_modules/@dns-modules', import.meta.url)) } },
  build: { rollupOptions: { input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), home: fileURLToPath(new URL('./home.html', import.meta.url)), premium: fileURLToPath(new URL('./premium.html', import.meta.url)) } } },
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'legacy-js-api'] } } },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  }
})
