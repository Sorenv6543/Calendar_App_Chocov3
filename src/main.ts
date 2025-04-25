import { createApp, type App } from "vue";
import { createPinia, type Pinia } from "pinia";
import AppComponent from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

// Import CSS
import "./assets/main.css";

const app: App = createApp(AppComponent);
const pinia: Pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount("#app");
