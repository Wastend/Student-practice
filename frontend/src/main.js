import "primeicons/primeicons.css";
import "./assets/css/index.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import App from "./App.vue";
import initialAxios from "./helpers/api/axios";
import router from "./router";

initialAxios();

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: ".p-dark",
      cssLayer: false,
    },
  },
});

app.use(createPinia());
app.use(router);
app.use(ToastService);

app.mount("#app");
