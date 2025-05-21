import "primeicons/primeicons.css";
import "./assets/css/index.css";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from 'primevue/tooltip';
import { createApp } from "vue";
import App from "./App.vue";
import initialAxios from "./helpers/api/axios";
import router from "./router";

initialAxios();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    ripple: true,
    inputStyle: "filled",
    theme: Aura
});
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.mount("#app");
