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
              <h3>Ваши предложения</h3>
              <div v-if="vacancies.length === 0" class="no-data-message">
                <i class="pi pi-briefcase" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
                <p>У вас пока нет созданных предложений</p>
                <Button label="Создать вакансию" class="p-button-outlined" @click="router.push('/vacancies/create')" />
              </div>
              <VacanciesTable v-else :vacancies="vacancies" :vacancy-delete="deleteVacancy" />
            </div>
            <div v-if="user.role_id === 2" class="tests-section">
              <h3>Ваши тесты</h3>
              <div v-if="tests.length === 0" class="no-data-message">
                <i class="pi pi-file" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
                <p>У вас пока нет созданных тестов</p>
                <Button label="Создать тест" class="p-button-outlined" @click="router.push('/tests/create')" />
              </div>
              <TestsTable v-else :tests="tests" @editTest="editTest" @deleteTest="deleteTest" />
            </div>

            <EmployerTasks v-if="user.role_id === 2" />

            <div v-if="user.role_id === 1" class="applications-section">
              <h3>Ваши заявки</h3>
              <div v-if="applications.length === 0" class="no-data-message">
                <i class="pi pi-send" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
                <p>У вас пока нет отправленных заявок</p>
                <Button label="Найти предложение" class="p-button-outlined" @click="router.push('/vacancies')" />
              </div>
              <div v-else class="applications-list">
                <div v-for="application in applications" :key="application.id" class="application-item">
                  <div class="application-info">
                    <router-link :to="`/vacancies/${application.job_id}`" class="job-title">
                      {{ application.job_title }}
                    </router-link>
                    <span class="application-status" :class="application.status">
                      {{ getStatusText(application.status) }}
                    </span>
                  </div>
                  <div class="application-date">
                    Отправлена: {{ new Date(application.applied_at).toLocaleDateString('ru-RU') }}
                  </div>
                  <div class="application-actions" v-if="application.status === 'accepted'">
                    <Button 
                      class="p-button-success"
                      @click="router.push('/student/tasks')"
                    >
                      <i class="pi pi-tasks"></i>
                      Перейти к заданиям
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="user.role_id === 2" class="applications-section">
              <h3>Отклики на предложения</h3>
              <div v-if="companyApplications.length === 0" class="no-data-message">
                <i class="pi pi-send" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
                <p>У вас пока нет откликов на предложения</p>
              </div>
              <div v-else class="applications-list">
                <div v-for="application in companyApplications" :key="application.id" class="application-item">
                  <div class="application-info">
                    <div class="application-main">
                      <router-link :to="`/vacancies/${application.job_id}`" class="job-title">
                        {{ application.job_title }}
                      </router-link>
                      <div class="student-info">
                        <span class="student-name">{{ application.student_name }}</span>
                        <span class="student-email">{{ application.student_email }}</span>
                        <span class="application-date">
                          Отправлена: {{ new Date(application.applied_at).toLocaleDateString('ru-RU') }}
                        </span>
                      </div>
                    </div>
                    <div class="application-actions">
                      <span class="application-status" :class="application.status">
                        {{ getStatusText(application.status) }}
                      </span>
                      <Button 
                        v-if="application.cover_letter_id"
                        icon="pi pi-file" 
                        class="p-button-text" 
                        @click="downloadStudentCoverLetter(application.cover_letter_id)"
                        v-tooltip.top="'Скачать сопроводительное письмо'"
                      />
                      <div class="status-actions">
                        <Button 
                          v-if="application.status === 'applied'"
                          icon="pi pi-check" 
                          class="p-button-text p-button-success" 
                          @click="updateApplicationStatus(application.id, 'interview')"
                          v-tooltip.top="'Пригласить на собеседование'"
                        />
                        <Button 
                          v-if="application.status === 'interview'"
                          icon="pi pi-check" 
                          class="p-button-text p-button-success" 
                          @click="updateApplicationStatus(application.id, 'accepted')"
                          v-tooltip.top="'Принять'"
                        />
                        <Button 
                          v-if="['applied', 'interview'].includes(application.status)"
                          icon="pi pi-times" 
                          class="p-button-text p-button-danger" 
                          @click="updateApplicationStatus(application.id, 'rejected')"
                          v-tooltip.top="'Отклонить'"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                <div v-else class="file-upload">
                  <FileUpload
                    mode="basic"
                    :auto="false"
                    accept=".pdf,.doc,.docx"
                    :maxFileSize="5000000"
                    chooseLabel="Загрузить сопроводительное письмо"
                    @select="onFileSelect"
                    :customUpload="true"
                    :uploadHandler="uploadFile"
                    :showUploadButton="true"
                    :showCancelButton="true"
                  />
                  <small class="p-text-secondary">
                    Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 5MB
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
import EmployerTasks from '@/components/pages/profile/EmployerTasks.vue';
import StudentTasks from '@/components/pages/profile/StudentTasks.vue';
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
  deleteCoverLetter,
  getCompanyApplications,
  updateApplicationStatus as updateApplicationStatusAPI,
  downloadStudentCoverLetter as downloadStudentCoverLetterAPI
} from "@/api/index";

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
const companyApplications = ref([]);

onMounted(async () => {
  isLoading.value = true;
  try {
    user.value = await getProfile();
    Object.assign(editForm.value, user.value);

    if (user.value.role_id === 2) {
      try {
        vacancies.value = await getJobs({ employer_id: user.value.id });
        companyApplications.value = await getCompanyApplications();
      } catch (error) {
        vacancies.value = [];
        companyApplications.value = [];
      }

      try {
        tests.value = await getTests({ employer_id: user.value.id });
      } catch (error) {
        tests.value = [];
      }
    }

    if (user.value.role_id === 1) {
      try {
        applications.value = await getApplications({ student_id: user.value.id });
      } catch (error) {
        applications.value = [];
      }
    }

    if (user.value.cover_letter) {
      coverLetter.value = {
        name: user.value.cover_letter.name,
        id: user.value.cover_letter.id
      };
      localStorage.setItem('coverLetter', JSON.stringify(coverLetter.value));
    }
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    toast.add({ 
      severity: 'error', 
      summary: 'Ошибка', 
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

const onFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    uploadFile(file);
  }
};

const truncateFileName = (fileName) => {
  if (!fileName) return '';
  if (fileName.length > 30) {
    const extension = fileName.split('.').pop();
    const name = fileName.substring(0, 30 - extension.length - 3);
    return `${name}...${extension}`;
  }
  return fileName;
};

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await uploadCoverLetter(file);
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
      detail: error.response?.data?.message || 'Не удалось загрузить файл',
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
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось скачать файл',
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

const getStatusText = (status) => {
  const statusMap = {
    'applied': 'Отправлена',
    'interview': 'Собеседование',
    'rejected': 'Отклонена',
    'accepted': 'Принята'
  };
  return statusMap[status] || status;
};

const getStatusSeverity = (status) => {
  const statusMap = {
    'applied': 'info',
    'interview': 'warning',
    'rejected': 'danger',
    'accepted': 'success'
  };
  return statusMap[status] || 'info';
};

const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    await updateApplicationStatusAPI(applicationId, newStatus);
    const application = companyApplications.value.find(app => app.id === applicationId);
    if (application) {
      application.status = newStatus;
    }
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Статус заявки обновлен',
      life: 3000
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса заявки:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось обновить статус заявки',
      life: 3000
    });
  }
};

const downloadStudentCoverLetter = async (coverLetterId) => {
  try {
    const response = await downloadStudentCoverLetterAPI(coverLetterId);
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cover_letter_${coverLetterId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании сопроводительного письма:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось скачать сопроводительное письмо',
      life: 3000
    });
  }
};

const cancelApplication = (applicationId) => {
  // Implementation of cancelApplication method
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

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: var(--surface-ground);
  border-radius: 8px;
  margin: 1rem 0;
}

.no-data-message p {
  margin: 1rem 0;
  color: var(--text-color-secondary);
}

.no-data-message .p-button {
  margin-top: 1rem;
}

.tests-section,
.applications-section {
  margin-top: 30px;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-item {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--surface-border);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.application-header h4 {
  margin: 0;
  color: var(--text-color);
}

.application-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
}

.detail-item i {
  color: var(--primary-color);
}

.application-actions {
  margin-top: 1rem;
}

.application-actions .p-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.application-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.job-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
}

.job-title:hover {
  text-decoration: underline;
}

.application-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.application-status.applied {
  background-color: var(--primary-color);
  color: white;
}

.application-status.interview {
  background-color: var(--warning-color);
  color: white;
}

.application-status.rejected {
  background-color: var(--danger-color);
  color: white;
}

.application-status.accepted {
  background-color: var(--success-color);
  color: white;
}

.application-date {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.application-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.student-name {
  font-weight: 500;
  color: var(--text-color);
}

.student-email {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.application-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-actions {
  display: flex;
  gap: 0.5rem;
}

.tasks-section {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 8px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-ground);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-info {
  flex: 1;
}

.task-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.task-description {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.task-actions {
  margin-left: 1rem;
}
</style>
