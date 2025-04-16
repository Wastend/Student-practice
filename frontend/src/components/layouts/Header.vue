<!-- filepath: /Users/evgeniy/sites/Student-practice/frontend/src/components/layouts/Header.vue -->
<template>
  <header class="header">
    <div class="container">
      <div class="header-wrap">
        <div class="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="14" y1="8" x2="20" y2="8"></line>
            <line x1="4" y1="8" x2="10" y2="8"></line>
            <line x1="12" y1="12" x2="12" y2="16"></line>
          </svg>
          <span>Student Practice</span>
        </div>
        <div class="nav-actions">
          <nav class="nav-links">
            <router-link to="/" class="nav-item">Главная</router-link>
            <router-link to="/students" class="nav-item">Студенты</router-link>
            <router-link to="/employers" class="nav-item"
              >Работодатели</router-link
            >
            <router-link to="/admin" class="nav-item"
              >Администраторы</router-link
            >
          </nav>
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const isDarkTheme = ref(false);

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  document.documentElement.classList.toggle("dark", isDarkTheme.value);
};
</script>

<style scoped>
.header {
  background-color: var(--surface-ground);
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem; /* Расстояние между навигацией и кнопкой переключения темы */
}

.nav-links {
  display: flex;
  gap: 1.5rem; /* Расстояние между пунктами навигации */
}

.nav-item {
  text-decoration: none;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: var(--primary-color);
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.theme-toggle:hover {
  background-color: var(--primary-color);
  color: #fff;
}
</style>
