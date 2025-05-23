<template>
  <template v-if="route.name === 'Vacancies'">
    <div v-if="loading" class="loader">Загрузка...</div>
    <div v-else class="vacancies-page">
      <div class="filters-section">
        <div class="search-box">
          <InputText v-model="filters.search" placeholder="Поиск вакансий..." class="search-input" />
        </div>
        <div class="filters-grid">
          <div class="filter-item">
            <label for="category">Категория</label>
            <Dropdown
              id="category"
              v-model="filters.category"
              :options="categories"
              optionLabel="name"
              placeholder="Выберите категорию"
              class="w-full"
              :showClear="true"
            />
          </div>
          <div class="filter-item">
            <label for="location">Город</label>
            <Dropdown
              id="location"
              v-model="filters.location"
              :options="locations"
              optionLabel="name"
              placeholder="Выберите город"
              class="w-full"
              :showClear="true"
            />
          </div>
          <div class="filter-item">
            <label for="experience">Опыт работы</label>
            <Dropdown
              id="experience"
              v-model="filters.experience_level"
              :options="experienceLevels"
              optionLabel="name"
              placeholder="Выберите опыт"
              class="w-full"
              :showClear="true"
            />
          </div>
          <div class="filter-item">
            <label for="employment">Тип занятости</label>
            <Dropdown
              id="employment"
              v-model="filters.employment_type"
              :options="employmentTypes"
              optionLabel="name"
              placeholder="Выберите тип"
              class="w-full"
              :showClear="true"
            />
          </div>
        </div>
      </div>
      <VacanciesBlock :vacancies="filteredVacancies" />
    </div>
  </template>
  <router-view v-else />
</template>

<script setup>
import VacanciesBlock from "@/components/pages/homepage/VacanciesBlock.vue";
import { useRoute } from "vue-router";
import { getJobs } from "@/api/index";
import { ref, onMounted, computed } from "vue";
import { InputText, Dropdown } from "primevue";

const route = useRoute();
const vacancies = ref([]);
const loading = ref(true);
const filters = ref({
  search: '',
  category: null,
  location: null,
  experience_level: null,
  employment_type: null
});

// Опции для фильтров
const categories = ref([
  { name: 'Разработка', value: 'development' },
  { name: 'Дизайн', value: 'design' },
  { name: 'Маркетинг', value: 'marketing' },
  { name: 'Менеджмент', value: 'management' }
]);

const locations = ref([
  { name: 'Москва', value: 'moscow' },
  { name: 'Санкт-Петербург', value: 'spb' },
  { name: 'Удаленно', value: 'remote' }
]);

const experienceLevels = ref([
  { name: 'Без опыта', value: 'no_experience' },
  { name: 'До 1 года', value: 'less_than_year' },
  { name: '1-3 года', value: '1-3_years' },
  { name: '3-5 лет', value: '3-5_years' },
  { name: 'Более 5 лет', value: 'more_than_5_years' }
]);

const employmentTypes = ref([
  { name: 'Полная занятость', value: 'full_time' },
  { name: 'Частичная занятость', value: 'part_time' },
  { name: 'Проектная работа', value: 'project' },
  { name: 'Стажировка', value: 'internship' }
]);

// Фильтрация вакансий
const filteredVacancies = computed(() => {
  return vacancies.value.filter(vacancy => {
    // Поиск по тексту
    if (filters.value.search && !vacancy.title.toLowerCase().includes(filters.value.search.toLowerCase()) &&
        !vacancy.description.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }

    // Фильтр по категории
    if (filters.value.category && vacancy.category !== filters.value.category.value) {
      return false;
    }

    // Фильтр по городу
    if (filters.value.location && vacancy.location !== filters.value.location.value) {
      return false;
    }

    // Фильтр по опыту
    if (filters.value.experience_level && vacancy.experience_level !== filters.value.experience_level.value) {
      return false;
    }

    // Фильтр по типу занятости
    if (filters.value.employment_type && vacancy.employment_type !== filters.value.employment_type.value) {
      return false;
    }

    return true;
  });
});

onMounted(async () => {
  try {
    vacancies.value = await getJobs({ status: 'published' });
  } catch (error) {
    console.error("Ошибка при загрузке вакансий:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.vacancies-page {
  padding: 2rem 0;
}

.filters-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-weight: 500;
  color: var(--text-color);
}

.loader {
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 2rem;
}
</style>
