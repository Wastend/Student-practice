<template>
  <section class="create-vacancy">
    <div class="container">
      <div class="create-vacancy-wrap">
        <Card class="create-vacancy-card">
          <template #title>
            <h2 class="create-vacancy-title">
              {{ isEditing ? "Редактирование вакансии" : "Создание вакансии" }}
            </h2>
          </template>
          <template #content>
            <form @submit.prevent="handleSubmit">
              <!-- Название вакансии -->
              <div class="form-group">
                <label for="title">Название вакансии</label>
                <InputText id="title" v-model="vacancy.title" required />
              </div>

              <!-- Описание вакансии -->
              <div class="form-group">
                <label for="description">Описание</label>
                <Textarea
                  id="description"
                  v-model="vacancy.description"
                  rows="4"
                  autoResize
                  required
                />
              </div>

              <!-- Выбор теста -->
              <div class="form-group">
                <label for="test">Тест для кандидатов</label>
                <Dropdown
                  id="test"
                  v-model="vacancy.testId"
                  :options="tests"
                  optionLabel="title"
                  placeholder="Выберите тест"
                />
                <Button
                  label="Создать новый тест"
                  class="p-button-text p-button-primary mt-2"
                  @click="goToCreateTest"
                />
              </div>

              <!-- Остальные поля -->
              <div class="form-group">
                <label for="location">Локация</label>
                <InputText id="location" v-model="vacancy.location" required />
              </div>

              <div class="form-group">
                <label for="remote">Дистанционная работа</label>
                <Checkbox
                  id="remote"
                  v-model="vacancy.remote"
                  binary
                  true-value="Да"
                  false-value="Нет"
                />
              </div>

              <!-- Кнопка отправки -->
              <Button
                :label="isEditing ? 'Сохранить изменения' : 'Создать вакансию'"
                class="btn-primary"
                type="submit"
              />
            </form>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  InputText,
  Textarea,
} from "primevue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createJob } from "@/api";

const router = useRouter();
const route = useRoute();

const vacancy = ref({
  title: "",
  description: "",
  testId: null,
  location: "",
  remote: false,
});

const tests = ref([
  { id: 1, title: "Тест на знание JavaScript" },
  { id: 2, title: "Тест на аналитическое мышление" },
]);

const isEditing = ref(false);

onMounted(() => {
  const vacancyId = route.params.id;
  if (vacancyId) {
    isEditing.value = true;
    // Пример загрузки данных вакансии
    vacancy.value = {
      title: "Пример вакансии",
      description: "Описание вакансии",
      testId: 1,
      location: "Москва",
      remote: true,
    };
  }
});

const handleSubmit = async () => {
  try {
    await createJob(vacancy.value);
    alert("Вакансия успешно создана!");
    router.push("/profile");
  } catch (error) {
    console.error("Ошибка при создании вакансии:", error);
    alert("Ошибка при создании вакансии");
  }
};

const goToCreateTest = () => {
  router.push("/tests/create");
};
</script>

<style scoped>
.create-vacancy {
  padding: 2rem 0;
}

.create-vacancy-wrap {
  display: flex;
  width: 100%;
}

.create-vacancy-card {
  display: flex;
  width: 100%;
  padding: 2rem;
}

.create-vacancy-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

textarea,
input {
  width: 100%;
}

textarea {
  resize: none;
}

.btn-primary {
  width: 100%;
}
</style>
