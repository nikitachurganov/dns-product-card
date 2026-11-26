import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import PremiumApp from './PremiumApp.vue'

import '../styles/fonts.css'
import '@dns-modules/font-icon/style.css'
import '@dns-modules/font-icon-v3/font-icon.scss'
import '@dns-modules/base-ui-button/style.css'
import '@dns-modules/base-link/style.css'
import '@dns-modules/bottom-sheet/style.css'
import '../styles/dns-tokens.css'
import './styles/premium.css'
import { vFade } from '../home/fade'
import { vReveal } from './reveal'

createApp(PremiumApp)
  .directive('fade', vFade)
  .directive('reveal', vReveal)
  .use(createI18n({ legacy: false, locale: 'ru', fallbackLocale: 'ru', messages: { ru: {} } }))
  .mount('#app')
