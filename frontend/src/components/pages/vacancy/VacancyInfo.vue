<template>
  <section class="vacancy-info">
    <div class="container">
      <div class="vacancy-info-wrap">
        <Card class="info-card">
          <template #title>
            <h2 class="info-title">Детали вакансии</h2>
          </template>
          <template #content>
            <!-- Обязанности -->
            <div class="info-section">
              <h3 class="section-title">Обязанности</h3>
              <ul class="section-list">
                <li v-for="(item, index) in responsibilities" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Требования -->
            <div class="info-section">
              <h3 class="section-title">Требования</h3>
              <ul class="section-list">
                <li v-for="(item, index) in requirements" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Условия -->
            <div class="info-section">
              <h3 class="section-title">Условия</h3>
              <ul class="section-list">
                <li>Длительность: {{ conditions.duration }}</li>
                <li>График: {{ conditions.schedule }}</li>
                <li>
                  Поддержка наставника:
                  {{ conditions.mentorSupport ? "Да" : "Нет" }}
                </li>
                <li>Сертификат: {{ conditions.certificate ? "Да" : "Нет" }}</li>
                <li>
                  Возможность трудоустройства:
                  {{ conditions.possibilityOfEmployment ? "Да" : "Нет" }}
                </li>
                <li>Оплачиваемая: {{ conditions.paid ? "Да" : "Нет" }}</li>
              </ul>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Card } from "primevue";

const props = defineProps({
  responsibilities: Array,
  requirements: Array,
  conditions: Object,
});
</script>

<style scoped>
.vacancy-info {
  margin-top: -40px;
}

.info-card {
  width: 100%;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.info-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.info-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.section-list {
  list-style: disc;
  padding-left: 1.5rem;
}

.section-list li {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.vacancy-info-wrap {
  display: flex;
  width: 100%;
}
</style>
