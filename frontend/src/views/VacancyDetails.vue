<template>
  <div class="vacancy-details">
    <Card>
      <template #title>
        <h2>{{ vacancy.title }}</h2>
      </template>
      <template #content>
        <!-- Кнопка отклика для студентов -->
        <div v-if="user?.role === 'student'" class="apply-section">
          <Button
            label="Откликнуться на вакансию"
            class="p-button-primary"
            @click="showApplyDialog = true"
          />
        </div>
      </template>
    </Card>

    <!-- Диалог отклика -->
    <ApplyToVacancy
      v-model:visible="showApplyDialog"
      :vacancy-id="vacancy.id"
      :vacancy-title="vacancy.title"
      @applied="handleApplied"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Card, Button } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { getVacancyById } from '@/api';
import ApplyToVacancy from '@/components/pages/vacancy/ApplyToVacancy.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const vacancy = ref({});
const showApplyDialog = ref(false);
const toast = useToast();

onMounted(async () => {
  try {
    const vacancyId = route.params.id;
    vacancy.value = await getVacancyById(vacancyId);
  } catch (error) {
    console.error('Ошибка при загрузке вакансии:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить данные вакансии',
      life: 3000
    });
  }
});

const handleApplied = () => {
  toast.add({
    severity: 'success',
    summary: 'Успех',
    detail: 'Вы успешно откликнулись на вакансию',
    life: 3000
  });
};
</script>

<style scoped>
.vacancy-details {
  padding: 2rem 0;
}

.apply-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style> 