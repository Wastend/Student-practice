<template>
  <div class="vacancies-table">
    <template v-if="vacancies.length > 0">
      <DataTable :value="vacancies" class="p-datatable-gridlines">
        <Column field="title" header="Название" />
        <Column field="location" header="Локация" />
        <Column field="status" header="Статус" />
        <Column header="Действия">
          <template #body="slotProps">
            <div class="actions">
              <Button label="Редактировать" class="p-button-text p-button-primary"
                @click="editVacancy(slotProps.data.id)" />
              <Button label="Удалить" class="p-button-text p-button-danger" @click="deleteVacancy(slotProps.data.id)" />
              <Button :label="slotProps.data.status === 'Опубликована' ? 'Снять с публикации' : 'Опубликовать'"
                class="p-button-text p-button-success" @click="togglePublish(slotProps.data.id)" />
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
    console.log(11111); // Лог для проверки
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

  const togglePublish = (id) => {
    const vacancy = vacancies.value.find((vacancy) => vacancy.id === id);
    if (vacancy) {
      vacancy.status =
        vacancy.status === "Опубликована" ? "Черновик" : "Опубликована";
      alert(
        `Вакансия ${vacancy.status === "Опубликована"
          ? "опубликована"
          : "снята с публикации"
        }!`
      );
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