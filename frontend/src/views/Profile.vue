<template>
  <section class="profile">
    <div class="container">
      <div class="profile-wrap">
        <ProgressSpinner v-if="isLoading" style="width:50px;height:50px;display:block;margin:40px auto;" />
        <Card v-else-if="user !== null" class="profile-card">
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

            <div v-if="user.role_id === 1" class="applications-section">
              <h3>Ваши заявки</h3>
              <ul>
                <li v-for="application in applications" :key="application.id">
                  <strong>{{ application.job_title }}</strong> - {{ application.status }}
                </li>
              </ul>
            </div>

            <!-- Секция сопроводительного письма -->
            <div v-if="user.role_id === 1" class="form-group">
              <h3>Сопроводительное письмо</h3>
              <div class="cover-letter-section">
                <div v-if="coverLetter" class="current-file">
                  <div class="file-info">
                    <i class="pi pi-file" style="font-size: 1.5rem; color: var(--primary-color);"></i>
                    <div class="file-details">
                      <p class="file-name" :title="coverLetter.name">{{ truncateFileName(coverLetter.name) }}</p>
                      <small class="file-status">Загружено</small>
                    </div>
                  </div>
                  <div class="file-actions">
                    <Button 
                      icon="pi pi-download" 
                      class="p-button-text" 
                      @click="downloadCoverLetter"
                      v-tooltip.top="'Скачать'"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      class="p-button-text p-button-danger" 
                      @click="removeCoverLetter"
                      v-tooltip.top="'Удалить'"
                    />
                  </div>
                </div>
                <div class="file-upload">
                  <FileUpload
                    mode="basic"
                    :auto="true"
                    accept=".pdf,.doc,.docx"
                    :maxFileSize="1000000"
                    chooseLabel="Загрузить сопроводительное письмо"
                    @upload="onFileUpload"
                    :customUpload="true"
                    :uploadHandler="uploadFile"
                    :showUploadButton="false"
                    :showCancelButton="false"
                  />
                  <small class="p-text-secondary">
                    Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 1MB
                  </small>
                </div>
              </div>
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
import { Button, Card, Dialog, InputText, Textarea, FileUpload } from "primevue";
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from 'primevue/progressspinner';
import VacanciesTable from '@/components/pages/vacancy/VacanciesTable.vue'
import TestsTable from '@/components/pages/vacancy/TestsTable.vue'
import { 
  getProfile, 
  updateProfile, 
  getJobs, 
  getTests, 
  getApplications, 
  deleteTestAPI, 
  deleteJob, 
  uploadCoverLetter, 
  downloadCoverLetterFile, 
  deleteCoverLetter 
} from "@/api";

const router = useRouter();
const toast = useToast();
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
const isLoading = ref(true);
const coverLetter = ref(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    user.value = await getProfile();
    Object.assign(editForm.value, user.value);

    if (user.value.role_id === 2) {
      vacancies.value = await getJobs({ employer_id: user.value.id });
      try {
        tests.value = await getTests({ employer_id: user.value.id });
      } catch (error) {
        console.error("Ошибка при загрузке тестов:", error);
        tests.value = [];
      }
    }
    if (user.value.role_id === 1) {
      applications.value = await getApplications({ student_id: user.value.id });
    }

    if (user.value.cover_letter) {
      coverLetter.value = {
        name: user.value.cover_letter.name,
        id: user.value.cover_letter.id
      };
    }
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    toast.add({ 
      severity: 'warn', 
      summary: 'Предупреждение', 
      detail: 'Не удалось загрузить данные профиля. Попробуйте обновить страницу.', 
      life: 3000 
    });
    user.value = null;
  } finally {
    isLoading.value = false;
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
      await deleteTestAPI(id);
      tests.value = tests.value.filter((test) => test.id !== id);
      toast.add({ severity: 'success', summary: 'Успех', detail: 'Тест успешно удалён', life: 3000 });
    } catch (error) {
      console.error("Ошибка при удалении теста:", error);
      toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить тест', life: 3000 });
    }
  }
};

const deleteVacancy = async (id) => {
  try {
    await deleteJob(id);
    vacancies.value = vacancies.value.filter((vacancy) => vacancy.id !== id);
    toast.add({ severity: 'success', summary: 'Успех', detail: 'Вакансия успешно удалена', life: 3000 });
  } catch (error) {
    console.error("Ошибка при удалении вакансии:", error);
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить вакансию', life: 3000 });
  }
};

const handleEditProfile = async () => {
  try {
    const updatedUser = await updateProfile(editForm.value);
    user.value = updatedUser;
    showEditPopup.value = false;
    toast.add({ severity: 'success', summary: 'Успех', detail: 'Профиль успешно обновлён', life: 3000 });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить профиль', life: 3000 });
  }
};

const onFileUpload = (event) => {
  const file = event.files[0];
  if (file) {
    uploadFile(file);
  }
};

const truncateFileName = (fileName) => {
  if (fileName.length > 30) {
    const extension = fileName.split('.').pop();
    const name = fileName.substring(0, 30 - extension.length - 3);
    return `${name}...${extension}`;
  }
  return fileName;
};

onBeforeMount(() => {
  const savedCoverLetter = localStorage.getItem('coverLetter');
  if (savedCoverLetter) {
    coverLetter.value = JSON.parse(savedCoverLetter);
  }
});

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await uploadCoverLetter(formData);
    coverLetter.value = {
      name: file.name,
      id: response.id
    };
    
    localStorage.setItem('coverLetter', JSON.stringify(coverLetter.value));
    
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Сопроводительное письмо успешно загружено',
      life: 3000
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить файл',
      life: 3000
    });
  }
};

const downloadCoverLetter = async () => {
  try {
    const response = await downloadCoverLetterFile(coverLetter.value.id);
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', coverLetter.value.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось скачать файл',
      life: 3000
    });
  }
};

const removeCoverLetter = async () => {
  try {
    await deleteCoverLetter(coverLetter.value.id);
    coverLetter.value = null;
    localStorage.removeItem('coverLetter');
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Сопроводительное письмо удалено',
      life: 3000
    });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить файл',
      life: 3000
    });
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

.cover-letter-section {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.current-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--surface-ground);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  margin: 0;
  font-weight: 500;
  color: var(--text-color);
}

.file-status {
  color: var(--text-color-secondary);
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
