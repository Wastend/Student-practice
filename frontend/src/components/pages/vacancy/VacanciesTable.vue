<template>
  <div class="vacancies-table">
    <DataTable :value="vacancies" class="p-datatable-gridlines">
      <template #empty>
        <div>
          <div
            v-for="r in 3"
            :key="r"
            class="table-skeleton-row"
          >
            <div
              v-for="c in 4"
              :key="c"
              class="table-skeleton-column"
            >
              <Skeleton />
            </div>
          </div>
        </div>
      </template>
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Skeleton from 'primevue/skeleton';

const props = defineProps({
  vacancies: {
    type: Array,
    required: true,
  },
});

const vacancies = ref(props.vacancies)

const router = useRouter();

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
</style>
