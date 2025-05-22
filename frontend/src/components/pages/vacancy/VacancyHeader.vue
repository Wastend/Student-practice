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
              <div class="conditions-list">
                <div class="condition-item" v-if="work_schedule">
                  <span class="condition-label">График работы:</span>
                  <span class="condition-value">{{ work_schedule }}</span>
                </div>
                <div class="condition-item" v-if="employment_type">
                  <span class="condition-label">Тип занятости:</span>
                  <span class="condition-value">{{ employment_type }}</span>
                </div>
                <div class="condition-item" v-if="experience_level">
                  <span class="condition-label">Опыт работы:</span>
                  <span class="condition-value">{{ experience_level }}</span>
                </div>
                <div class="condition-item" v-if="education_level">
                  <span class="condition-label">Образование:</span>
                  <span class="condition-value">{{ education_level }}</span>
                </div>
              </div>
            </div>
            <div class="vacancy-benefits" v-if="benefits">
              <h2 class="description-title">Преимущества</h2>
              <p class="description-text">{{ benefits }}</p>
            </div>
            <div class="vacancy-salary" v-if="salary">
              <h2 class="description-title">Зарплата</h2>
              <p class="description-text">{{ salary }} ₽</p>
            </div>
            <div class="vacancy-additional-conditions" v-if="hasAdditionalConditions">
              <h2 class="description-title">Дополнительные условия</h2>
              <div class="conditions-grid">
                <div v-if="mentor_support" class="condition-item">
                  <i class="pi pi-user-plus"></i>
                  <span>Поддержка ментора</span>
                </div>
                <div v-if="certificate" class="condition-item">
                  <i class="pi pi-id-card"></i>
                  <span>Сертификат по окончании</span>
                </div>
                <div v-if="possibility_of_employment" class="condition-item">
                  <i class="pi pi-briefcase"></i>
                  <span>Возможность трудоустройства</span>
                </div>
                <div v-if="paid" class="condition-item">
                  <i class="pi pi-money-bill"></i>
                  <span>Оплачиваемая стажировка</span>
                </div>
              </div>
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
import { computed, ref, onMounted } from 'vue';
import { getTags } from "@/api";

const router = useRouter();
const availableTags = ref([]);

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
  benefits: String,
  mentor_support: Boolean,
  certificate: Boolean,
  possibility_of_employment: Boolean,
  paid: Boolean
});

const getTagName = (tagId) => {
  const tag = availableTags.value.find(t => t.id === tagId);
  return tag ? tag.name : '';
};

onMounted(async () => {
  try {
    availableTags.value = await getTags();
  } catch (error) {
    console.error('Ошибка при загрузке тегов:', error);
  }
});

const hasConditions = computed(() => {
  return props.work_schedule || props.employment_type || props.experience_level || props.education_level;
});

const hasAdditionalConditions = computed(() => {
  return props.mentor_support || props.certificate || props.possibility_of_employment || props.paid;
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
  color: var(--text-color);
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
  color: var(--text-color);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
  color: var(--text-color);
}

.condition-item i {
  color: var(--primary-color);
  font-size: 1.2rem;
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

.vacancy-additional-conditions {
  margin-top: 2rem;
}
</style>
