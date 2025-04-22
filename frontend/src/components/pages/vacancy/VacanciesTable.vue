<template>
  <div class="vacancies-table">
    <DataTable :value="vacancies" class="p-datatable-gridlines">
      <Column field="title" header="Название" />
      <Column field="location" header="Локация" />
      <Column field="status" header="Статус" />
      <Column header="Действия">
        <template #body="slotProps">
          <div class="actions">
            <Button
              label="Редактировать"
              class="p-button-text p-button-primary"
              @click="editVacancy(slotProps.data.id)"
            />
            <Button
              label="Удалить"
              class="p-button-text p-button-danger"
              @click="deleteVacancy(slotProps.data.id)"
            />
            <Button
              :label="
                slotProps.data.status === 'Опубликована'
                  ? 'Снять с публикации'
                  : 'Опубликовать'
              "
              class="p-button-text p-button-success"
              @click="togglePublish(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Button
      label="Создать вакансию"
      class="btn-primary"
      style="margin-top: 20px"
      @click="goToCreateVacancy"
    />
  </div>
</template>

<script setup>
import { Button, Column, DataTable } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const vacancies = ref([
  {
    id: 1,
    title: "Стажировка в IT-компании",
    location: "Москва",
    status: "Опубликована",
  },
  {
    id: 2,
    title: "Аналитик данных",
    location: "Санкт-Петербург",
    status: "Черновик",
  },
]);

const editVacancy = (id) => {
  router.push(`/vacancies/${id}/edit`);
};

const deleteVacancy = (id) => {
  if (confirm("Вы уверены, что хотите удалить эту вакансию?")) {
    const index = vacancies.value.findIndex((vacancy) => vacancy.id === id);
    if (index !== -1) {
      vacancies.value.splice(index, 1);
      alert("Вакансия удалена!");
    }
  }
};

const togglePublish = (id) => {
  const vacancy = vacancies.value.find((vacancy) => vacancy.id === id);
  if (vacancy) {
    vacancy.status =
      vacancy.status === "Опубликована" ? "Черновик" : "Опубликована";
    alert(
      `Вакансия ${
        vacancy.status === "Опубликована"
          ? "опубликована"
          : "снята с публикации"
      }!`
    );
  }
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
