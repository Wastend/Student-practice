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
              <Button label="Редактировать профиль" class="btn-primary mt-2" @click="showEditPopup = true" />
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
              <VacanciesTable :vacancies="vacancies" :vacancy-delete="deleteVacancy" />
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

    <!-- Попап для редактирования профиля -->
    <Dialog v-model:visible="showEditPopup" header="Редактирование профиля" :modal="true" :closable="true">
      <form @submit.prevent="handleEditProfile">
        <div class="form-group">
          <label for="username">Имя</label>
          <InputText id="username" v-model="editForm.username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <InputText id="email" v-model="editForm.email" required />
        </div>
        <div v-if="user.role_id === 2" class="form-group">
          <label for="companyName">Название компании</label>
          <InputText id="companyName" v-model="editForm.company_name" />
        </div>
        <div v-if="user.role_id === 2" class="form-group">
          <label for="companyWebsite">Веб-сайт компании</label>
          <InputText id="companyWebsite" v-model="editForm.company_website" />
        </div>
        <div v-if="user.role_id === 2" class="form-group">
          <label for="companyDescription">Описание компании</label>
          <Textarea id="companyDescription" v-model="editForm.company_description" rows="3" />
        </div>
        <Button label="Сохранить" class="btn-primary mt-2" type="submit" />
      </form>
    </Dialog>
  </section>
</template>

<script setup>
import { Button, Card, Dialog, InputText, Textarea } from "primevue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VacanciesTable from '@/components/pages/vacancy/VacanciesTable.vue'
import TestsTable from '@/components/pages/vacancy/TestsTable.vue'
import { getProfile, updateProfile, getJobs, getTests, getApplications, deleteTestAPI, deleteJob } from "@/api";

const router = useRouter();
const user = ref(null);
const vacancies = ref([]);
const tests = ref([]);
const applications = ref([]);
const showEditPopup = ref(false);
const editForm = ref({
  username: "",
  email: "",
  company_name: "",
  company_website: "",
  company_description: "",
});

onMounted(async () => {
  try {
    user.value = await getProfile();
    Object.assign(editForm.value, user.value);

    // Если пользователь — работодатель, загружаем его вакансии
    if (user.value.role_id === 2) {
      vacancies.value = await getJobs({ employer_id: user.value.id });
      try {
        tests.value = await getTests({ employer_id: user.value.id });
      } catch (error) {
        console.error("Ошибка при загрузке тестов:", error);
        tests.value = []; // Устанавливаем пустой массив, если произошла ошибка
      }
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

const deleteVacancy = async (id) => {
  try {
    await deleteJob(id); // Вызываем API для удаления вакансии
    vacancies.value = vacancies.value.filter((vacancy) => vacancy.id !== id); // Удаляем из списка
  } catch (error) {
    console.error("Ошибка при удалении вакансии:", error);
    alert("Не удалось удалить вакансию");
  }
};

const handleEditProfile = async () => {
  try {
    const updatedUser = await updateProfile(editForm.value);
    user.value = updatedUser;
    showEditPopup.value = false;
    alert("Профиль успешно обновлён!");
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    alert("Не удалось обновить профиль");
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

.form-group {
  margin-bottom: 1.5rem;
}
</style>
