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
              <Tag class="vacancy-category" severity="info">{{ category }}</Tag>
              <Tag class="vacancy-location" severity="success">{{
                location
              }}</Tag>
              <Tag class="vacancy-company" severity="warning">{{
                company.name
              }}</Tag>
            </div>
            <div class="vacancy-description">
              <h2 class="description-title">Описание</h2>
              <p class="description-text">{{ description }}</p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Card, Tag } from "primevue";

const props = defineProps({
  title: String,
  category: String,
  location: String,
  company: Object,
  description: String,
});
</script>

<style scoped>
.vacancy-header {
  margin-top: -40px;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
}
</style>
