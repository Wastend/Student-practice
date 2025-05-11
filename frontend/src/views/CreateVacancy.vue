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
                />
              </div>

              <div class="form-group">
                <label for="salary">Оплата труда</label>
                <InputNumber id="salary" v-model="vacancy.salary" :min="0" placeholder="Введите оплату труда" />
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
  InputNumber,
} from "primevue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createJob, updateJob } from "@/api";
import { getTests } from "@/api";
import { getJobById } from "@/api";

const router = useRouter();
const route = useRoute();

const vacancy = ref({
  title: "",
  description: "",
  testId: null,
  location: "",
  remote: false,
  salary: 0,
  status: "draft", // Значение по умолчанию
});

const tests = ref([]);

const isEditing = ref(false);

onMounted(async () => {
  try {
    tests.value = await getTests(); // Загружаем тесты
  } catch (error) {
    console.error("Ошибка при загрузке тестов:", error);
    alert("Не удалось загрузить тесты");
  }

  const vacancyId = route.params.id;
  if (vacancyId) {
    isEditing.value = true;
    try {
      const vacancyData = await getJobById(vacancyId); // Загружаем данные вакансии
      vacancy.value = {
        title: vacancyData.title,
        description: vacancyData.description,
        testId: tests.value.find((test) => test.id === vacancyData.test_id) || null, // Находим объект теста
        location: vacancyData.location,
        remote: !!vacancyData.remote, // Преобразуем в булевое значение
        salary: vacancyData.salary || 0,
        status: vacancyData.status || "draft",
      };
    } catch (error) {
      console.error("Ошибка при загрузке вакансии:", error);
      alert("Не удалось загрузить данные вакансии");
      router.push("/profile");
    }
  }
});

const handleSubmit = async () => {
  try {
    const payload = {
      ...vacancy.value,
      testId: vacancy.value.testId?.id || null,
      remote: vacancy.value.remote ? 1 : 0,
    };

    if (isEditing.value) {
      await updateJob(route.params.id, payload);
      alert("Вакансия успешно обновлена!");
    } else {
      await createJob(payload);
      alert("Вакансия успешно создана!");
    }

    router.push("/profile");
  } catch (error) {
    console.error("Ошибка при сохранении вакансии:", error);
    alert("Ошибка при сохранении вакансии");
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
