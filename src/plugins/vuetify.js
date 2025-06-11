/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { createVuetify } from "vuetify"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1976d2",
          secondary: "#42a5f5",
          surface: "#ffffff",
          background: "#fafafa",
        },
      },
      dark: {
        colors: {
          primary: "#2196f3",
          secondary: "#64b5f6",
        },
      },
    },
  },
})
