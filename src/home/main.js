import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import HomeApp from './HomeApp.vue'

import '../styles/fonts.css'
import '@dns-modules/font-icon/style.css'
import '@dns-modules/font-icon-v3/font-icon.scss'
import '@dns-modules/base-ui-button/style.css'
import '@dns-modules/base-link/style.css'
import '@dns-modules/base-ui-tabs/style.css'
import '@dns-modules/bottom-sheet/style.css'
import '../styles/dns-tokens.css'
import './styles/home.css'
import { vFade } from './fade'

createApp(HomeApp)
  .directive('fade', vFade)
  .use(createI18n({ legacy: false, locale: 'ru', fallbackLocale: 'ru', messages: { ru: {} } }))
  .mount('#app')
