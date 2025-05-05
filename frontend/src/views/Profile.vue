<template>
  <section class="profile">
    <div class="container">
      <div class="profile-wrap">
        <Card v-if="user !== null" class="profile-card">
          <template #content>
            <div class="profile-info">
              <h3>Информация</h3>
              <ul>
                <li><strong>Имя:</strong> {{ user.username }}</li>
                <li><strong>Email:</strong> {{ user.email }}</li>
                <li v-if="user.role_id === 1">
                  <strong>Роль:</strong> Студент
                </li>
                <li v-if="user.role_id === 2">
                  <strong>Роль:</strong> Компания
                </li>
              </ul>
            </div>

            <div v-if="user.role_id === 2" class="company-info">
              <h3>Информация о компании</h3>
              <ul>
                <li><strong>Название:</strong> {{ user.company_name }}</li>
                <li>
                  <strong>Веб-сайт: </strong>
                  <a :href="user.company_website" target="_blank">{{
                    user.company_website
                  }}</a>
                </li>
                <li>
                  <strong>Описание:</strong> {{ user.company_description }}
                </li>
              </ul>
            </div>
            <div v-if="user.role_id === 2" class="vacancies-section">
              <h3>Ваши вакансии</h3>
              <VacanciesTable :vacancies="vacancies"/>
            </div>
            <div v-if="user.role_id === 2" class="tests-section">
              <h3>Ваши тесты</h3>
              <TestsTable
                :tests="tests"
                @editTest="editTest"
                @deleteTest="deleteTest"
              />
            </div>
            <div v-if="user.role_id === 2" class="add-test-section">
              <AddTestForm />
            </div>

            <div v-if="user.role_id === 1" class="applications-section">
              <h3>Ваши заявки</h3>
              <ul>
                <li v-for="application in applications" :key="application.id">
                  <strong>{{ application.job_title }}</strong> - {{ application.status }}
                </li>
              </ul>
            </div>

            <Button
              label="Выйти из аккаунта"
              class="btn-danger mt-2"
              @click="logout"
            />
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Button, Card } from "primevue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VacanciesTable from '@/components/pages/vacancy/VacanciesTable.vue'
import TestsTable from '@/components/pages/vacancy/TestsTable.vue'
import { getProfile, getJobs, getTests, getApplications, deleteTestAPI } from "@/api";

const router = useRouter();
const user = ref(null);
const vacancies = ref([]);
const tests = ref([]);
const applications = ref([]);

onMounted(async () => {
  try {
    user.value = await getProfile();

    // Если пользователь — работодатель, загружаем его вакансии
    if (user.value.role_id === 2) {
      vacancies.value = await getJobs({ employer_id: user.value.id });
      tests.value = await getTests({ employer_id: user.value.id });
      console.log(vacancies.value, tests.value);
      
    }

    // Если пользователь — студент, загружаем его заявки
    if (user.value.role_id === 1) {
      applications.value = await getApplications({ student_id: user.value.id });
    }
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    alert("Не удалось загрузить данные профиля");
    router.push("/login");
  }
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const editTest = (id) => {
  router.push(`/tests/${id}/edit`);
};

const deleteTest = async (id) => {
  if (confirm("Вы уверены, что хотите удалить этот тест?")) {
    try {
      await deleteTestAPI(id); // Реализуем API для удаления теста
      tests.value = tests.value.filter((test) => test.id !== id);
      alert("Тест удалён!");
    } catch (error) {
      console.error("Ошибка при удалении теста:", error);
      alert("Не удалось удалить тест");
    }
  }
};
</script>

<style scoped>
.profile {
  padding: 2rem 0;
}

.profile-wrap {
  width: 100%;
}

.profile-info,
.company-info {
  margin-bottom: 2rem;
}

.profile-info h3,
.company-info h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.profile-info ul,
.company-info ul {
  list-style: none;
  padding: 0;
}

.profile-info li,
.company-info li {
  margin-bottom: 0.5rem;
}

.btn-danger {
  background-color: var(--danger-color);
  color: #fff;
}

.btn-danger:hover {
  background-color: darken(var(--danger-color), 10%);
}

.vacancies {
  margin-top: 2rem;
}

.vacancies h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.vacancies ul {
  list-style: none;
  padding: 0;
}

.vacancies li {
  margin-bottom: 0.5rem;
}
</style>
