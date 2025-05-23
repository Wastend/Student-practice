import "primeicons/primeicons.css";
import "./assets/css/index.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import App from "./App.vue";
import initialAxios from "./helpers/api/axios";
import { checkAuth } from "./router/authMiddleware";
import router from "./router";
import Tooltip from 'primevue/tooltip';

initialAxios();

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Проверяем авторизацию при запуске приложения
checkAuth().then(() => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: ".p-dark",
        cssLayer: false,
      },
    },
    ripple: true
  });

  app.use(router);
  app.use(ToastService);
  app.directive('tooltip', Tooltip);

  app.mount("#app");
});
