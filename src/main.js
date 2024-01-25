/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import pt from './locale/pt.json'
import en from './locale/en.json'
// Plugins
import { registerPlugins } from '@/plugins'
const app = createApp(App)
registerPlugins(app)
const i18n = createI18n({
  legacy: false,
  locale: pt,
  messages: {
    pt: pt,
    en: en,
  }
})
app.mount('#app')
app.use(i18n)
