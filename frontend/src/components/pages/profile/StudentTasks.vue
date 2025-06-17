<template>
  <div class="student-tasks">
    <div v-if="tasks.length === 0" class="no-tasks">
      <i class="pi pi-tasks" style="font-size: 2rem; color: var(--text-color-secondary);"></i>
      <p>У вас пока нет заданий</p>
      <Button class="p-button-outlined" @click="router.push('/vacancies')">
        Найти практику
      </Button>
    </div>
    <div v-else class="tasks-list">
      <div v-for="task in tasks" :key="task.id" class="task-card">
        <div class="task-header">
          <div class="task-title">
            <h4>{{ task.title }}</h4>
            <Tag :severity="getStatusSeverity(task.status)" :value="getStatusText(task.status)" />
          </div>
          <div class="task-vacancy">
            <i class="pi pi-briefcase"></i>
            {{ task.vacancy_title }}
          </div>
        </div>
        
        <div class="task-content">
          <div class="task-description">
            <h5>Описание задания</h5>
            <p>{{ task.description }}</p>
          </div>
          
          <div class="task-details">
            <div class="detail-item">
              <i class="pi pi-calendar"></i>
              <span>Дедлайн: {{ task.deadline ? new Date(task.deadline).toLocaleDateString() : 'не указан' }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-list"></i>
              <span>Критерии оценки: {{ task.criteria }}</span>
            </div>
            <div class="detail-item" v-if="task.file">
              <i class="pi pi-file"></i>
              <a :href="task.file" target="_blank">Скачать материалы</a>
            </div>
          </div>

          <div class="task-response" v-if="task.status !== 'completed'">
            <h5>Ваш ответ</h5>
            <div class="response-form">
              <Textarea v-model="task.response" rows="5" placeholder="Введите ваш ответ..." />
              <div class="file-upload">
                <label class="upload-label">
                  <i class="pi pi-upload"></i>
                  Прикрепить файл
                  <input type="file" @change="onFileUpload($event, task)" style="display: none" />
                </label>
                <span v-if="task.uploadedFile" class="file-name">
                  <a :href="task.uploadedFile.url" target="_blank">
                    <i class="pi pi-file"></i>
                    {{ task.uploadedFile.name }}
                  </a>
                  <Button icon="pi pi-times" class="p-button-text p-button-danger" @click="removeFile(task)" />
                </span>
              </div>
              <Button 
                class="p-button-success" 
                :disabled="!task.response && !task.uploadedFile"
                @click="submitResponse(task)"
              >
                <i class="pi pi-send"></i>
                Отправить ответ
              </Button>
            </div>
          </div>

          <div class="task-feedback" v-if="task.status === 'completed'">
            <h5>Обратная связь</h5>
            <div class="feedback-content">
              <p v-if="task.feedback">{{ task.feedback }}</p>
              <p v-else>Ожидается обратная связь от работодателя</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Tag, Textarea } from 'primevue';

const router = useRouter();

// Тестовые данные
const tasks = ref([
  {
    id: 1,
    title: 'Создание компонента',
    description: 'Разработать компонент на Vue.js с использованием Composition API. Компонент должен быть переиспользуемым и содержать документацию.',
    deadline: '2024-04-01',
    criteria: 'Чистый код, документация, типизация',
    status: 'in_progress',
    vacancy_title: 'Frontend разработчик',
    response: 'Реализовал компонент с использованием Composition API. Добавил документацию и типизацию.',
    uploadedFile: { name: 'component.zip', url: '#' },
    feedback: null
  },
  {
    id: 2,
    title: 'Работа с API',
    description: 'Интеграция с REST API, обработка ошибок, оптимизация запросов. Необходимо реализовать кэширование и обработку офлайн-режима.',
    deadline: '2024-04-15',
    criteria: 'Обработка ошибок, оптимизация, безопасность',
    status: 'pending',
    vacancy_title: 'Frontend разработчик',
    response: '',
    uploadedFile: null,
    feedback: null
  },
  {
    id: 3,
    title: 'Тестирование компонентов',
    description: 'Написание unit-тестов для компонентов Vue.js. Требуется покрыть основные сценарии использования.',
    deadline: '2024-04-20',
    criteria: 'Покрытие тестами, качество тестов',
    status: 'completed',
    vacancy_title: 'Frontend разработчик',
    response: 'Реализовал тесты для всех компонентов с использованием Jest и Vue Test Utils.',
    uploadedFile: { name: 'tests.zip', url: '#' },
    feedback: 'Отличная работа! Тесты покрывают все основные сценарии.'
  }
]);

const getStatusSeverity = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Выполнено';
    case 'in_progress':
      return 'В процессе';
    case 'pending':
      return 'Ожидает выполнения';
    default:
      return status;
  }
};

const onFileUpload = (event, task) => {
  const file = event.target.files[0];
  if (file) {
    task.uploadedFile = file;
  }
};

const removeFile = (task) => {
  task.uploadedFile = null;
};

const submitResponse = (task) => {
  if (task.response || task.uploadedFile) {
    task.status = 'in_progress';
    // В реальном приложении здесь был бы запрос к API
    alert('Ответ отправлен!');
  }
};
</script>

<style scoped>
.student-tasks {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 8px;
}

.no-tasks {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.no-tasks i {
  margin-bottom: 1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--surface-border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.task-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.task-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.task-description {
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.task-response {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface-ground);
  border-radius: 6px;
  border: 1px solid var(--surface-border);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.response-date {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.response-content {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--surface-card);
  border-radius: 4px;
  border: 1px solid var(--surface-border);
}

.response-feedback {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--surface-hover);
  border-radius: 4px;
  font-style: italic;
  color: var(--text-color-secondary);
}

.task-vacancy {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-description h5,
.task-response h5,
.task-feedback h5 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.task-description p {
  margin: 0;
  color: var(--text-color-secondary);
  line-height: 1.5;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 6px;
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

.response-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.upload-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  cursor: pointer;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
}

.file-name a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
}

.file-name a:hover {
  text-decoration: underline;
}

.task-feedback {
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 6px;
}

.feedback-content {
  color: var(--text-color-secondary);
  line-height: 1.5;
}
</style> 