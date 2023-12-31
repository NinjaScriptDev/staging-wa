/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import $axios from "@/plugins/axios";

const app = createApp(App);
app.provide("$axios", $axios);
window.$axios = $axios;

registerPlugins(app);

app.mount("#app");
