<template>
  <section class="vacancies">
    <div class="container">
      <div class="vacancies-wrap">
        <h2 class="vacancies-title">Доступные вакансии</h2>
        <div v-if="vacancies.length > 0" class="vacancies-list">
          <div
            v-for="vacancy in vacancies"
            :key="vacancy.id"
            class="vacancy-card"
          >
            <div class="vacancy-top">
              <h3 class="vacancy-title">{{ vacancy.title }}</h3>
              <p class="vacancy-description">{{ vacancy.description }}</p>
            </div>

            <div class="vacancy-bottom">
              <p>{{ vacancy.company }}</p>
              <RouterLink
                :to="`/vacancies/${vacancy.id}`"
                class="btn btn-primary"
              >
                Подробнее
              </RouterLink>
            </div>
          </div>
        </div>
        <p v-else class="no-vacancies">Вакансии не найдены</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  vacancies: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.vacancies {
  padding: 2rem 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

.vacancies-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.vacancies-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--primary-color);
}

.vacancies-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.vacancy-card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
  background-color: var(--surface-ground);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.vacancy-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.vacancy-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.vacancy-description {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.no-vacancies {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.vacancy-bottom p {
  margin: 0;
}

.vacancy-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
