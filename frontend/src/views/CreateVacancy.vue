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

              <!-- Обязанности -->
              <div class="form-group">
                <label for="responsibilities">Обязанности</label>
                <div class="list-items">
                  <div v-for="(item, index) in responsibilities" :key="index" class="list-item">
                    <InputText v-model="item.text" placeholder="Введите обязанность" />
                    <Button
                      icon="pi pi-times"
                      class="p-button-text p-button-danger"
                      @click="removeResponsibility(index)"
                    />
                  </div>
                </div>
                <Button
                  label="Добавить обязанность"
                  class="p-button-text p-button-success mt-2"
                  @click="addResponsibility"
                />
              </div>

              <!-- Требования -->
              <div class="form-group">
                <label for="requirements">Требования</label>
                <div class="list-items">
                  <div v-for="(item, index) in requirements" :key="index" class="list-item">
                    <InputText v-model="item.text" placeholder="Введите требование" />
                    <Button
                      icon="pi pi-times"
                      class="p-button-text p-button-danger"
                      @click="removeRequirement(index)"
                    />
                  </div>
                </div>
                <Button
                  label="Добавить требование"
                  class="p-button-text p-button-success mt-2"
                  @click="addRequirement"
                />
              </div>

              <!-- Теги -->
              <div class="form-group">
                <label for="tags">Теги</label>
                <MultiSelect
                  id="tags"
                  v-model="selectedTags"
                  :options="availableTags"
                  optionLabel="name"
                  placeholder="Выберите теги"
                  :filter="true"
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

              <div class="form-group">
                <label for="benefits">Преимущества</label>
                <Textarea v-model="benefits" rows="5" class="w-full" />
              </div>

              <div class="form-group">
                <h3 class="section-title">Дополнительные условия</h3>
                <div class="conditions-grid">
                  <div class="condition-item">
                    <Checkbox v-model="conditions.mentorSupport" :binary="true" />
                    <label>Поддержка ментора</label>
                  </div>
                  <div class="condition-item">
                    <Checkbox v-model="conditions.certificate" :binary="true" />
                    <label>Сертификат по окончании</label>
                  </div>
                  <div class="condition-item">
                    <Checkbox v-model="conditions.possibilityOfEmployment" :binary="true" />
                    <label>Возможность трудоустройства</label>
                  </div>
                  <div class="condition-item">
                    <Checkbox v-model="conditions.paid" :binary="true" />
                    <label>Оплачиваемая стажировка</label>
                  </div>
                </div>
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
  MultiSelect,
} from "primevue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createJob, updateJob, getTests, getTags } from "@/api";
import { getJobById } from "@/api";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const vacancy = ref({
  title: "",
  description: "",
  category: "",
  location: "",
  remote: false,
  salary: 0,
  testId: null,
  tags: [],
});

const responsibilities = ref([]);
const requirements = ref([]);

const tests = ref([]);
const availableTags = ref([]);
const selectedTags = ref([]);

const isEditing = ref(false);
const benefits = ref('');

const conditions = ref({
  mentorSupport: false,
  certificate: false,
  possibilityOfEmployment: false,
  paid: false
});

const addResponsibility = () => {
  responsibilities.value.push({ text: "" });
};

const removeResponsibility = (index) => {
  responsibilities.value.splice(index, 1);
};

const addRequirement = () => {
  requirements.value.push({ text: "" });
};

const removeRequirement = (index) => {
  requirements.value.splice(index, 1);
};

onMounted(async () => {
  try {
    tests.value = await getTests();
    availableTags.value = await getTags();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    alert("Не удалось загрузить данные");
  }

  const vacancyId = route.params.id;
  if (vacancyId) {
    isEditing.value = true;
    try {
      const job = await getJobById(vacancyId);
      
      vacancy.value = {
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        remote: !!job.remote,
        salary: job.salary || 0,
        testId: tests.value.find((test) => test.id === job.test_id) || null,
        tags: job.tags || [],
      };
      benefits.value = job.benefits;
      
      // Загрузка условий работы
      conditions.value = {
        mentorSupport: !!job.mentor_support,
        certificate: !!job.certificate,
        possibilityOfEmployment: !!job.possibility_of_employment,
        paid: !!job.paid
      };

      // Загрузка обязанностей
      responsibilities.value = job.responsibilities.map(item => ({ text: item.text }));

      // Загрузка требований
      requirements.value = job.requirements.map(item => ({ text: item.text }));

      // Загрузка тегов
      selectedTags.value = job.tags.map(tag => tag.id);
    } catch (error) {
      console.error('Ошибка при загрузке вакансии:', error);
      alert("Не удалось загрузить данные вакансии");
      router.push("/profile");
    }
  }
});

const handleSubmit = async () => {
  try {
    const jobData = {
      title: vacancy.value.title,
      description: vacancy.value.description,
      category: vacancy.value.category,
      location: vacancy.value.location,
      remote: vacancy.value.remote,
      salary: vacancy.value.salary,
      testId: vacancy.value.testId?.id || null,
      responsibilities: responsibilities.value,
      requirements: requirements.value,
      tags: selectedTags.value,
      benefits: benefits.value,
      mentor_support: conditions.value.mentorSupport,
      certificate: conditions.value.certificate,
      possibility_of_employment: conditions.value.possibilityOfEmployment,
      paid: conditions.value.paid
    };

    if (isEditing.value) {
      await updateJob(route.params.id, jobData);
      alert("Вакансия успешно обновлена!");
    } else {
      await createJob(jobData);
      alert("Вакансия успешно создана!");
    }

    router.push("/profile");
  } catch (error) {
    console.error('Ошибка при сохранении вакансии:', error);
    alert('Произошла ошибка при сохранении вакансии');
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

.list-items {
  margin-bottom: 1rem;
}

.list-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.list-item input {
  flex: 1;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.condition-item label {
  cursor: pointer;
  user-select: none;
}

.condition-item :deep(.p-checkbox) {
  width: 1.25rem;
  height: 1.25rem;
}

.condition-item :deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
}

.condition-item :deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
