<template>
  <div class="tasks-container" v-if="isEmployer || isStudent">
    <h2>Задания практики/стажировки</h2>
    
    <div v-if="isEmployer" class="add-task-section">
      <button @click="showAddTaskForm = true" class="btn-primary">
        <i class="pi pi-plus"></i> Добавить задание
      </button>
    </div>

    <!-- Форма добавления задания -->
    <div v-if="showAddTaskForm && isEmployer" class="task-form">
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
          <button type="submit" class="btn-primary">Отправить задание</button>
          <button type="button" @click="showAddTaskForm = false" class="btn-secondary">Отмена</button>
        </div>
      </form>
    </div>

    <!-- Список заданий -->
    <div v-if="tasks.length > 0" class="tasks-list">
      <div v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.title || `Задание #${task.id}` }}</h3>
          <span :class="['status-badge', task.status]">{{ getStatusText(task.status) }}</span>
        </div>

        <div class="task-content">
          <p class="task-description">{{ task.description }}</p>
          
          <div v-if="task.file_url" class="task-file">
            <a :href="task.file_url" target="_blank" class="btn-link">
              <i class="pi pi-download"></i> Скачать файл задания
            </a>
          </div>

          <!-- Ответ студента -->
          <div v-if="task.student_response" class="student-response">
            <h4>Ответ студента:</h4>
            <p>{{ task.student_response.text }}</p>
            <div v-if="task.student_response.file_url" class="response-file">
              <a :href="task.student_response.file_url" target="_blank" class="btn-link">
                <i class="pi pi-download"></i> Скачать файл ответа
              </a>
            </div>
          </div>

          <!-- Форма ответа студента -->
          <div v-if="isStudent && task.status === 'pending'" class="response-form">
            <form @submit.prevent="submitResponse(task.id)">
              <div class="form-group">
                <label>Ваш ответ:</label>
                <textarea v-model="taskResponses[task.id]" required class="form-control"></textarea>
              </div>
              
              <div class="form-group">
                <label>Файл ответа:</label>
                <input type="file" @change="(e) => handleResponseFileUpload(e, task.id)" class="form-control" />
              </div>

              <button type="submit" class="btn-primary">Отправить ответ</button>
            </form>
          </div>

          <!-- Действия работодателя -->
          <div v-if="isEmployer && task.status === 'submitted'" class="employer-actions">
            <button @click="approveTask(task.id)" class="btn-success">
              <i class="pi pi-check"></i> Принять
            </button>
            <button @click="rejectTask(task.id)" class="btn-danger">
              <i class="pi pi-times"></i> Отклонить
            </button>
            <button @click="rejectAndBlockTask(task.id)" class="btn-danger">
              <i class="pi pi-ban"></i> Отклонить и заблокировать
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-tasks-message">
      <i class="pi pi-tasks" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
      <p v-if="isEmployer">У вас пока нет созданных заданий</p>
      <p v-else>Для этой вакансии пока нет заданий</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const props = defineProps({
  vacancyId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const tasks = ref([]);
const showAddTaskForm = ref(false);
const newTask = ref({
  title: '',
  description: '',
  deadline_days: 7,
  type: 'practice',
  evaluation_criteria: '',
  file: null
});
const taskResponses = ref({});
const responseFiles = ref({});

const isEmployer = computed(() => authStore.user?.role_id === 2);
const isStudent = computed(() => authStore.user?.role_id === 1);

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

const handleFileUpload = (event) => {
  newTask.value.file = event.target.files[0];
};

const handleResponseFileUpload = (event, taskId) => {
  responseFiles.value[taskId] = event.target.files[0];
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
    formData.append('vacancy_id', props.vacancyId);

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

const submitResponse = async (taskId) => {
  try {
    const formData = new FormData();
    formData.append('text', taskResponses.value[taskId]);
    if (responseFiles.value[taskId]) {
      formData.append('file', responseFiles.value[taskId]);
    }

    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/response`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
    
    taskResponses.value[taskId] = '';
    responseFiles.value[taskId] = null;
  } catch (error) {
    console.error('Ошибка при отправке ответа:', error);
  }
};

const approveTask = async (taskId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/approve`);
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
  } catch (error) {
    console.error('Ошибка при принятии задания:', error);
  }
};

const rejectTask = async (taskId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/reject`);
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
  } catch (error) {
    console.error('Ошибка при отклонении задания:', error);
  }
};

const rejectAndBlockTask = async (taskId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/tasks/${taskId}/reject-and-block`);
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = response.data;
    }
  } catch (error) {
    console.error('Ошибка при отклонении и блокировке задания:', error);
  }
};

// Загрузка заданий при монтировании компонента
const fetchTasks = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/tasks`, {
      params: {
        vacancy_id: props.vacancyId
      }
    });
    tasks.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке заданий:', error);
  }
};

fetchTasks();
</script>

<style scoped>
.tasks-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-task-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.task-form {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.task-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.submitted { background: #cce5ff; color: #004085; }
.status-badge.approved { background: #d4edda; color: #155724; }
.status-badge.rejected { background: #f8d7da; color: #721c24; }
.status-badge.blocked { background: #e2e3e5; color: #383d41; }

.task-content {
  margin-top: 10px;
}

.student-response {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.response-form {
  margin-top: 15px;
}

.employer-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

button:hover {
  opacity: 0.9;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

select.form-control {
  background-color: white;
}

.task-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending { background: #fff3cd; color: #856404; }
.status-badge.submitted { background: #cce5ff; color: #004085; }
.status-badge.approved { background: #d4edda; color: #155724; }
.status-badge.rejected { background: #f8d7da; color: #721c24; }
.status-badge.blocked { background: #e2e3e5; color: #383d41; }

.btn-link {
  color: #2196f3;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-link:hover {
  text-decoration: underline;
}

.no-tasks-message {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

.no-tasks-message i {
  margin-bottom: 1rem;
}
</style> 