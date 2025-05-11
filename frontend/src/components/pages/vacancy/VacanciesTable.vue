<template>
  <div class="vacancies-table">
    <template v-if="vacancies.length > 0">
      <DataTable :value="vacancies" class="p-datatable-gridlines">
        <Column field="title" header="Название" />
        <Column field="location" header="Локация" />
        <Column field="status" header="Статус">
          <template #body="slotProps">
            <span>{{ slotProps.data.status === 'published' ? 'Опубликована' : 'Черновик' }}</span>
          </template>
        </Column>
        <Column header="Действия">
          <template #body="slotProps">
            <div class="actions">
              <Button label="Редактировать" class="p-button-text p-button-primary"
                @click="editVacancy(slotProps.data.id)" />
              <Button label="Удалить" class="p-button-text p-button-danger" @click="deleteVacancy(slotProps.data.id)" />
              <Button
                :label="slotProps.data.status === 'published' ? 'Снять с публикации' : 'Опубликовать'"
                class="p-button-text p-button-success"
                @click="togglePublish(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
    <template v-else>
      <p class="no-data">Вакансии еще не добавлены.</p>
    </template>
    <Button label="Создать вакансию" class="btn-primary" style="margin-top: 20px" @click="goToCreateVacancy" />
  </div>
</template>

<script setup>
  import { Button, Column, DataTable } from "primevue";
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import Skeleton from 'primevue/skeleton';
  import { updateJob } from "@/api";

  const props = defineProps({
    vacancies: {
      type: Array,
      required: true,
    },
    vacancyDelete: {
      type: Function,
      required: true
    }
  });

  const vacancies = ref(props.vacancies)

  const router = useRouter();

  const editVacancy = (id) => {
    router.push(`/vacancies/${id}/edit`);
  };

  const deleteVacancy = async (id) => {
    if (confirm("Вы уверены, что хотите удалить эту вакансию?")) {
      try {
        await props.vacancyDelete(id); // Уведомляем родительский компонент
        alert("Вакансия успешно удалена!");
      } catch (error) {
        console.error("Ошибка при удалении вакансии:", error);
        alert("Не удалось удалить вакансию");
      }
    }
  };

  const togglePublish = async (id) => {
    const vacancyIndex = vacancies.value.findIndex((vacancy) => vacancy.id === id);
    if (vacancyIndex !== -1) {
      const vacancy = vacancies.value[vacancyIndex];
      const newStatus = vacancy.status === "published" ? "draft" : "published"; // Используем значения из базы данных
      try {
        await updateJob(id, { status: newStatus }); // Обновляем статус через API
        // Обновляем статус в массиве вакансий
        vacancies.value[vacancyIndex] = {
          ...vacancy,
          status: newStatus,
        };
        alert(`Вакансия ${newStatus === "published" ? "опубликована" : "снята с публикации"}!`);
      } catch (error) {
        console.error("Ошибка при изменении статуса вакансии:", error);
        alert("Не удалось изменить статус вакансии");
      }
    }
  };

  const goToCreateVacancy = () => {
    router.push("/vacancies/create");
  };

  watch(
    () => props.vacancies,
    () => vacancies.value = props.vacancies
  )

</script>

<style scoped>
  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .no-data {
    text-align: center;
    font-size: 1.2rem;
    color: var(--secondary-color);
    margin: 1rem 0;
  }
</style>