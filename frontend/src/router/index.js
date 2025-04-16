import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/vacancies",
    name: "Vacancies",
    component: () => import("../views/Vacancies.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
