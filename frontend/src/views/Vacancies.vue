<template>
  <template v-if="route.name === 'Vacancies'">
    <VacanciesBlock />
  </template>
  <router-view v-else />
</template>

<script setup>
import VacanciesBlock from "@/components/pages/homepage/VacanciesBlock.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
