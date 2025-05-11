<template>
  <template v-if="route.name === 'Vacancies'">
    <div v-if="loading" class="loader">Загрузка...</div>
    <VacanciesBlock v-else :vacancies="vacancies" />
  </template>
  <router-view v-else />
</template>

<script setup>
import VacanciesBlock from "@/components/pages/homepage/VacanciesBlock.vue";
import { useRoute } from "vue-router";
import { getJobs } from "@/api";
import { ref, onMounted } from "vue";

const route = useRoute();
const vacancies = ref([]);
const loading = ref(true);

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
.loader {
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 2rem;
}
</style>
