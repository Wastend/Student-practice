<template>
  <div class="tests-table">
    <template v-if="tests.length > 0">
      <DataTable :value="tests" class="p-datatable-gridlines">
        <Column field="title" header="Название теста" />
        <Column header="Действия">
          <template #body="slotProps">
            <div class="actions">
              <Button
                label="Редактировать"
                class="p-button-text p-button-primary"
                @click="editTest(slotProps.data.id)"
              />
              <Button
                label="Удалить"
                class="p-button-text p-button-danger"
                @click="deleteTest(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
    <template v-else>
      <p class="no-data">Тесты еще не добавлены.</p>
    </template>
    <Button
      label="Создать новый тест"
      class="btn-primary mt-2"
      @click="goToCreateTest"
    />
  </div>
</template>

<script setup>
import { Button, Column, DataTable } from "primevue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  tests: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleteTest", "editTest"]);

const editTest = (id) => {
  router.push(`/tests/${id}/edit`);
};

const deleteTest = (id) => {
  emit("deleteTest", id);
};

const goToCreateTest = () => {
  router.push("/tests/create");
};
</script>

<style scoped>
.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  margin-top: 1rem;
}

.no-data {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin: 1rem 0;
}
</style>
