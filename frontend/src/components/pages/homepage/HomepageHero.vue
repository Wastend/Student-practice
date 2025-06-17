<template>
  <section class="home">
    <div class="container">
      <div class="home-content">
        <h1 class="home-title">Добро пожаловать на Практис!</h1>
        <p class="home-description">
          Найдите идеальную практику или стажировку для вашего карьерного роста.
          Мы помогаем студентам и работодателям находить друг друга.
        </p>
        <div class="home-actions">
          <RouterLink to="/vacancies" class="btn btn-primary"
            >Найти предложение</RouterLink
          >
          <RouterLink to="/register" class="btn btn-secondary"
            >Регистрация</RouterLink
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  color: var(--text-color);
}

.home-content {
  text-align: center;
  max-width: 600px;
}

.home-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.home-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #fff;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: #fff;
}

.btn-secondary:hover {
  background-color: var(--primary-color);
}
</style>
