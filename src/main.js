/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"

// Plugins
import { registerPlugins } from "@/plugins"

// Global Styles
import "@/assets/styles/scrollbar.css"

const app = createApp(App)

registerPlugins(app)

app.mount("#app")
