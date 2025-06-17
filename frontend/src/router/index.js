import { createRouter, createWebHistory } from "vue-router";
import CreateTest from "../views/CreateTest.vue";
import CreateVacancy from "../views/CreateVacancy.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import Vacancies from "../views/Vacancies.vue";
import Vacancy from "../views/Vacancy.vue";
import EmployerVacancyTasks from "../components/pages/vacancy/EmployerVacancyTasks.vue";
import { checkAuth } from './authMiddleware';
import StudentTasks from '@/views/StudentTasks.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/vacancies",
    name: "Vacancies",
    component: Vacancies,
    children: [
      {
        path: "create",
        name: "Create Vacancy",
        component: CreateVacancy,
      },
      {
        path: ":id/edit",
        name: "Edit Vacancy",
        component: CreateVacancy,
      },
      {
        path: ":id",
        name: "Vacancy Card",
        component: Vacancy,
      },
      {
        path: ":id/tasks",
        name: "Vacancy Tasks",
        component: EmployerVacancyTasks,
      },
    ],
  },
  {
    path: "/tests/create",
    name: "Create Test",
    component: CreateTest,
  },
  {
    path: "/tests/:id/edit",
    name: "Edit Test",
    component: CreateTest,
  },
  {
    path: "/tests/:id/take",
    name: "TakeTest",
    component: () => import("@/views/TakeTest.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: '/student/tasks',
    name: 'StudentTasks',
    component: StudentTasks,
    meta: {
      requiresAuth: true,
      studentOnly: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Глобальный навигационный guard
router.beforeEach(async (to, from, next) => {
  // Проверяем авторизацию при каждом переходе
  await checkAuth();
  next();
});

export default router;
