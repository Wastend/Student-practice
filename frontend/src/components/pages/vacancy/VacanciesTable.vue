<template>
  <div class="vacancies-table">
    <ProgressSpinner v-if="isLoading" style="width:50px;height:50px;display:block;margin:40px auto;" />
    <template v-else>
      <DataTable v-if="vacancies.length > 0" :value="vacancies" class="p-datatable-gridlines">
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
      <p v-else class="no-data">Предложения еще не добавлены.</p>
      <Button label="Создать предложение" class="btn-primary" style="margin-top: 20px" @click="goToCreateVacancy" />
    </template>
  </div>
</template>

<script setup>
  import { Button, Column, DataTable } from "primevue";
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useToast } from "primevue/usetoast";
  import ProgressSpinner from 'primevue/progressspinner';
  import Skeleton from 'primevue/skeleton';
  import { updateJob } from "../../../api";

  const props = defineProps({
    vacancies: {
      type: Array,
      required: true,
    },
    vacancyDelete: {
      type: Function,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  });

  const vacancies = ref(props.vacancies)

  const router = useRouter();
  const toast = useToast();

  const editVacancy = (id) => {
    router.push(`/vacancies/${id}/edit`);
  };

  const deleteVacancy = async (id) => {
    if (confirm("Вы уверены, что хотите удалить эту предложение?")) {
      try {
        await props.vacancyDelete(id);
        toast.add({ severity: 'success', summary: 'Успех', detail: 'Предложение успешно удалена!', life: 3000 });
      } catch (error) {
        console.error("Ошибка при удалении предложения:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить предложение', life: 3000 });
      }
    }
  };

  const togglePublish = async (id) => {
    const vacancyIndex = vacancies.value.findIndex((vacancy) => vacancy.id === id);
    if (vacancyIndex !== -1) {
      const vacancy = vacancies.value[vacancyIndex];
      const newStatus = vacancy.status === "published" ? "draft" : "published";
      try {
        // Подготавливаем данные для обновления
        const updateData = {
          title: vacancy.title,
          description: vacancy.description,
          category: vacancy.category,
          location: vacancy.location,
          remote: vacancy.remote,
          salary: vacancy.salary,
          test_id: vacancy.test_id,
          work_schedule: vacancy.work_schedule,
          employment_type: vacancy.employment_type,
          experience_level: vacancy.experience_level,
          education_level: vacancy.education_level,
          benefits: vacancy.benefits,
          mentor_support: vacancy.mentor_support,
          certificate: vacancy.certificate,
          possibility_of_employment: vacancy.possibility_of_employment,
          paid: vacancy.paid,
          status: newStatus
        };

        await updateJob(id, updateData);
        toast.add({ severity: 'success', summary: 'Успех', detail: `Предложение ${newStatus === "published" ? "опубликована" : "снята с публикации"}!`, life: 3000 });
        vacancies.value[vacancyIndex] = {
          ...vacancy,
          status: newStatus,
        };
      } catch (error) {
        console.error("Ошибка при изменении статуса предложения:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось изменить статус предложения', life: 3000 });
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