<template>
  <section class="vacancy-header">
    <div class="container">
      <div class="vacancy-header-wrap">
        <Card class="vacancy-card">
          <template #title>
            <h1 class="vacancy-title">{{ title }}</h1>
          </template>
          <template #content>
            <div class="vacancy-meta">
              <Tag v-if="category" class="vacancy-category" severity="info">{{ category }}</Tag>
              <Tag v-if="location" class="vacancy-location" severity="success">{{ location }}</Tag>
              <Tag v-if="company?.name" class="vacancy-company" severity="warning">{{ company.name }}</Tag>
              <Tag v-if="remote" class="vacancy-remote" severity="info">Удаленная работа</Tag>
            </div>
            <div class="vacancy-tags" v-if="tags && tags.length">
              <Tag v-for="tag in tags" :key="tag.id" class="vacancy-tag" severity="help">
                {{ tag.name }}
              </Tag>
            </div>
            <div class="vacancy-description" v-if="description">
              <h2 class="description-title">Описание</h2>
              <p class="description-text">{{ description }}</p>
            </div>
            <div class="vacancy-responsibilities" v-if="responsibilities && responsibilities.length">
              <h2 class="description-title">Обязанности</h2>
              <ul class="list">
                <li v-for="(item, index) in responsibilities" :key="index" class="list-item">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <div class="vacancy-requirements" v-if="requirements && requirements.length">
              <h2 class="description-title">Требования</h2>
              <ul class="list">
                <li v-for="(item, index) in requirements" :key="index" class="list-item">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <div class="vacancy-conditions" v-if="hasConditions">
              <h2 class="description-title">Условия работы</h2>
              <div class="conditions-grid">
                <div class="condition-item" v-if="work_schedule">
                  <h3>График работы</h3>
                  <p>{{ work_schedule }}</p>
                </div>
                <div class="condition-item" v-if="employment_type">
                  <h3>Тип занятости</h3>
                  <p>{{ employment_type }}</p>
                </div>
                <div class="condition-item" v-if="experience_level">
                  <h3>Опыт работы</h3>
                  <p>{{ experience_level }}</p>
                </div>
                <div class="condition-item" v-if="education_level">
                  <h3>Образование</h3>
                  <p>{{ education_level }}</p>
                </div>
              </div>
              <div class="benefits" v-if="benefits">
                <h3>Преимущества</h3>
                <p>{{ benefits }}</p>
              </div>
            </div>
            <div class="vacancy-salary" v-if="salary">
              <h2 class="description-title">Зарплата</h2>
              <p class="description-text">{{ salary }} ₽</p>
            </div>
            <Button
              label="Пройти тест"
              class="btn-primary mt-2"
              @click="goToTest"
              v-if="test_id"
            />
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Card, Tag, Button } from "primevue";
import { useRouter } from "vue-router";
import { computed } from 'vue';

const router = useRouter();

const props = defineProps({
  title: String,
  category: String,
  location: String,
  company: Object,
  description: String,
  responsibilities: Array,
  requirements: Array,
  salary: Number,
  remote: Boolean,
  test_id: [String, Number],
  tags: Array,
  work_schedule: String,
  employment_type: String,
  experience_level: String,
  education_level: String,
  benefits: String
});

const hasConditions = computed(() => {
  return props.work_schedule || props.employment_type || props.experience_level || props.education_level || props.benefits;
});

const goToTest = () => {
  if (props.test_id) {
    router.push(`/tests/${props.test_id}/take`);
  }
};
</script>

<style scoped>
.vacancy-header,
.vacancy-header-wrap {
  width: 100%;
}

.vacancy-card {
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.vacancy-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.vacancy-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.vacancy-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.vacancy-category,
.vacancy-location,
.vacancy-company {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.vacancy-description {
  margin-top: 2rem;
}

.description-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  color: var(--primary-color);
}

.description-text {
  white-space: pre-line;
  line-height: 1.5;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.list-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.condition-item {
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.condition-item h3 {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.benefits {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.benefits h3 {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}
</style>
