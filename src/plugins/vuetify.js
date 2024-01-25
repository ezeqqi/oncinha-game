/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/settings.scss'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { VuetifyDateAdapter } from 'vuetify/labs/date/adapters/vuetify'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          background: '#f5f5f5',
          surface: '#f5f5f5',
          primary: '#3e5c81',
          secondary: '#5CBBF6',
        },
      },
      dark: {
        colors: {
          background: "#121212",
          primary: '#91a7dd',
          secondary: '#aed9fa',
        },
      },
    },
  },
  components: {
    VDatePicker,
  },
  date: {
    adapter: VuetifyDateAdapter,
  },
})
