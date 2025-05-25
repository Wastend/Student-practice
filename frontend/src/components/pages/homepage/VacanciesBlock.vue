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
            <div class="vacancy-header">
              <h3>{{ vacancy.title }}</h3>
              <span class="job-type">{{ vacancy.job_type === 'practice' ? 'Практика' : 'Стажировка' }}</span>
            </div>
            <div class="vacancy-meta">
              <div class="company-info">
                <span class="company">{{ vacancy.company }}</span>
                <span class="location">{{ vacancy.location }}</span>
              </div>
              <span class="date">{{ formatDate(vacancy.created_at) }}</span>
            </div>
            <div class="vacancy-bottom">
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};
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

.vacancy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.vacancy-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.company {
  font-size: 1rem;
  font-weight: bold;
  color: var(--primary-color);
}

.location {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.date {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.no-vacancies {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.vacancy-bottom {
  display: flex;
  justify-content: space-between;
}

.job-type {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
