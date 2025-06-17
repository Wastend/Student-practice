<template>
  <div class="tasks-section">
    <h3>Задания для практики</h3>
    <div v-if="vacancies.length === 0" class="no-data-message">
      <i class="pi pi-tasks" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
      <p>Для создания заданий сначала создайте вакансию</p>
      <Button class="p-button-outlined" @click="router.push('/vacancies/create')"> Создать вакансию </Button>
    </div>
    <div v-else class="tasks-list">
      <div v-for="vacancy in vacancies" :key="vacancy.id" class="task-item">
        <div class="task-info">
          <h4>{{ vacancy.title }}</h4>
          <p class="task-description">{{ vacancy.description }}</p>
          <div class="task-stats">
            <span class="stat">
              <i class="pi pi-list"></i> Заданий: {{ vacancy.tasks?.length || 0 }}
            </span>
            <span class="stat">
              <i class="pi pi-users"></i> Откликов: {{ vacancy.applications || 0 }}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <Button 
            class="p-button-primary" 
            @click="router.push(`/vacancies/${vacancy.id}/tasks`)"
          >
          Управление заданиями
          </Button>
        </div>
      </div>
    </div>

    <!-- Модальное окно управления заданиями -->
    <Dialog 
      v-model:visible="showModal" 
      :header="selectedVacancy ? `Задания для вакансии: ${selectedVacancy.title}` : 'Задания'" 
      :modal="true"
      :style="{ width: '80vw' }"
    >
      <div class="tasks-modal-content">
        <div class="add-task-section">
          <Button 
            class="p-button-primary" 
            @click="showAddTaskForm = true"
          >
          Добавить задание
          </Button>
        </div>

        <!-- Форма добавления задания -->
        <div v-if="showAddTaskForm" class="task-form">
          <h3>Новое задание</h3>
          <form @submit.prevent="submitTask">
            <div class="form-group">
              <label>Название задания:</label>
              <input type="text" v-model="newTask.title" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Описание задания:</label>
              <textarea v-model="newTask.description" required class="form-control"></textarea>
            </div>

            <div class="form-group">
              <label>Срок выполнения (дней):</label>
              <input type="number" v-model="newTask.deadline_days" required min="1" class="form-control" />
            </div>

            <div class="form-group">
              <label>Тип задания:</label>
              <select v-model="newTask.type" required class="form-control">
                <option value="practice">Практическое задание</option>
                <option value="test">Тестовое задание</option>
                <option value="project">Проектное задание</option>
              </select>
            </div>

            <div class="form-group">
              <label>Критерии оценки:</label>
              <textarea v-model="newTask.evaluation_criteria" required class="form-control" 
                placeholder="Опишите критерии, по которым будет оцениваться задание"></textarea>
            </div>
            
            <div class="form-group">
              <label>Файл задания:</label>
              <input type="file" @change="handleFileUpload" class="form-control" />
            </div>

            <div class="form-actions">
              <Button type="submit" label="Отправить задание" class="p-button-primary" />
              <Button type="button" label="Отмена" class="p-button-secondary" @click="showAddTaskForm = false" />
            </div>
          </form>
        </div>

        <!-- Список заданий -->
        <div v-if="tasks.length > 0" class="tasks-list">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <span :class="['status-badge', task.status]">{{ getStatusText(task.status) }}</span>
            </div>

            <div class="task-content">
              <p class="task-description">{{ task.description }}</p>
              
              <div v-if="task.file_url" class="task-file">
                <a :href="task.file_url" target="_blank" class="btn-link">
                  <i class="pi pi-download"></i> Скачать файл задания
                </a>
              </div>

              <!-- Ответы студентов -->
              <div v-if="task.student_responses && task.student_responses.length > 0" class="student-responses">
                <h4>Ответы студентов:</h4>
                <div v-for="response in task.student_responses" :key="response.id" class="student-response">
                  <div class="student-info">
                    <span class="student-name">{{ response.student_name }}</span>
                    <span class="response-date">{{ new Date(response.submitted_at).toLocaleDateString('ru-RU') }}</span>
                  </div>
                  <p class="response-text">{{ response.text }}</p>
                  <div v-if="response.file_url" class="response-file">
                    <a :href="response.file_url" target="_blank" class="btn-link">
                      <i class="pi pi-download"></i> Скачать файл ответа
                    </a>
                  </div>
                  <div v-if="response.status === 'submitted'" class="response-actions">
                    <Button 
                      icon="pi pi-check" 
                      class="p-button-success" 
                      @click="approveTask(task.id, response.id)"
                      v-tooltip.top="'Принять'"
                    />
                    <Button 
                      icon="pi pi-times" 
                      class="p-button-danger" 
                      @click="rejectTask(task.id, response.id)"
                      v-tooltip.top="'Отклонить'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-tasks-message">
          <i class="pi pi-tasks" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
          <p>У вас пока нет созданных заданий</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const vacancies = ref([]);
const tasks = ref([]);
const showModal = ref(false);
const showAddTaskForm = ref(false);
const selectedVacancy = ref(null);
const newTask = ref({
  title: '',
  description: '',
  deadline_days: 7,
  type: 'practice',
  evaluation_criteria: '',
  file: null
});

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Ожидает выполнения',
    submitted: 'На проверке',
    approved: 'Выполнено',
    rejected: 'Отклонено',
    blocked: 'Заблокировано'
  };
  return statusMap[status] || status;
};

const getTasksCount = (vacancyId) => {
  const vacancy = vacancies.value.find(v => v.id === vacancyId);
  return vacancy ? vacancy.tasks.length : 0;
};

const getApplicationsCount = (vacancyId) => {
  // Тестовые данные для откликов
  return Math.floor(Math.random() * 5);
};

const showTasksModal = async (vacancy) => {
  selectedVacancy.value = vacancy;
  showModal.value = true;
  await fetchTasks(vacancy.id);
};

const fetchTasks = async (vacancyId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/tasks`, {
      params: {
        vacancy_id: vacancyId
      }
    });
    tasks.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке заданий:', error);
  }
};

const handleFileUpload = (event) => {
  newTask.value.file = event.target.files[0];
};

const submitTask = async () => {
  try {
    const formData = new FormData();
    formData.append('title', newTask.value.title);
    formData.append('description', newTask.value.description);
    formData.append('deadline_days', newTask.value.deadline_days);
    formData.append('type', newTask.value.type);
    formData.append('evaluation_criteria', newTask.value.evaluation_criteria);
    if (newTask.value.file) {
      formData.append('file', newTask.value.file);
    }
    formData.append('vacancy_id', selectedVacancy.value.id);

    const response = await axios.post('http://localhost:3000/api/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    tasks.value.push(response.data);
    showAddTaskForm.value = false;
    newTask.value = {
      title: '',
      description: '',
      deadline_days: 7,
      type: 'practice',
      evaluation_criteria: '',
      file: null
    };
  } catch (error) {
    console.error('Ошибка при создании задания:', error);
  }
};

const approveTask = async (taskId, responseId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/responses/${responseId}/approve`);
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
  } catch (error) {
    console.error('Ошибка при принятии задания:', error);
  }
};

const rejectTask = async (taskId, responseId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/responses/${responseId}/reject`);
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
  } catch (error) {
    console.error('Ошибка при отклонении задания:', error);
  }
};

// Загрузка вакансий при монтировании компонента
const fetchVacancies = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/jobs', {
      params: {
        employer_id: authStore.user?.id
      }
    });
    vacancies.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке вакансий:', error);
  }
};

onMounted(() => {
  fetchVacancies();
  fetchTasks();
});
</script>

<style scoped>
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

.task-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.task-actions {
  margin-left: 1rem;
}

.tasks-modal-content {
  padding: 1rem;
}

.add-task-section {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.task-form {
  background: var(--surface-ground);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.student-responses {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.student-response {
  background: var(--surface-ground);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.student-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.student-name {
  font-weight: 500;
}

.response-date {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.response-text {
  margin: 0.5rem 0;
}

.response-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.submitted { background: #cce5ff; color: #004085; }
.status-badge.approved { background: #d4edda; color: #155724; }
.status-badge.rejected { background: #f8d7da; color: #721c24; }
.status-badge.blocked { background: #e2e3e5; color: #383d41; }

.btn-link {
  color: var(--primary-color);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.no-tasks-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.no-tasks-message i {
  margin-bottom: 1rem;
}

.no-data-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.no-data-message i {
  margin-bottom: 1rem;
}
</style> 