<template>
  <section class="profile">
    <div class="container">
      <div class="profile-wrap">
        <Card class="profile-card">
          <template #content>
            <div class="profile-info">
              <h3>Информация</h3>
              <ul>
                <li><strong>Имя:</strong> {{ user.name }}</li>
                <li><strong>Email:</strong> {{ user.email }}</li>
                <li v-if="user.role === 'student'">
                  <strong>Роль:</strong> Студент
                </li>
                <li v-if="user.role === 'company'">
                  <strong>Роль:</strong> Компания
                </li>
              </ul>
            </div>

            <div v-if="user.role === 'company'" class="company-info">
              <h3>Информация о компании</h3>
              <ul>
                <li><strong>Название:</strong> {{ user.companyName }}</li>
                <li>
                  <strong>Веб-сайт: </strong>
                  <a :href="user.companyWebsite" target="_blank">{{
                    user.companyWebsite
                  }}</a>
                </li>
                <li>
                  <strong>Описание:</strong> {{ user.companyDescription }}
                </li>
              </ul>
            </div>
            <div v-if="user.role === 'company'" class="vacancies-section">
              <h3>Ваши вакансии</h3>
              <VacanciesTable />
            </div>
            <div v-if="user.role === 'company'" class="tests-section">
              <h3>Ваши тесты</h3>
              <TestsTable
                :tests="tests"
                @editTest="editTest"
                @deleteTest="deleteTest"
              />
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
import TestsTable from "@/components/pages/vacancy/TestsTable.vue";
import VacanciesTable from "@/components/pages/vacancy/VacanciesTable.vue";
import { Button, Card } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Пример данных пользователя
const user = ref({
  name: "Иван Иванов",
  email: "ivan@example.com",
  role: "company", // "student" или "company"
  companyName: "TechStart",
  companyWebsite: "https://techstart.ru",
  companyDescription:
    "TechStart — это современная IT-компания, занимающаяся разработкой цифровых продуктов для бизнеса.",
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const goToCreateVacancy = () => {
  router.push("/vacancies/create");
};

const tests = ref([
  { id: 1, title: "Тест на знание JavaScript" },
  { id: 2, title: "Тест на аналитическое мышление" },
]);

const editTest = (id) => {
  console.log("Редактирование теста с ID:", id);
};

const deleteTest = (id) => {
  if (confirm("Вы уверены, что хотите удалить этот тест?")) {
    const index = tests.value.findIndex((test) => test.id === id);
    if (index !== -1) {
      tests.value.splice(index, 1);
      alert("Тест удален!");
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

.profile-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
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

.tests-section {
  margin-top: 2rem;
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
</style>
