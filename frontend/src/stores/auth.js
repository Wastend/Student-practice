import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user)); // Сохраняем пользователя в localStorage
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});