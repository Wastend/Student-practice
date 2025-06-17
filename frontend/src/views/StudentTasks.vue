<template>
  <div class="student-tasks">
    <Toast />
    <div class="tasks-container">
      <h2>Мои задания</h2>
      
      <div v-if="!tasks.length" class="no-tasks">
        <p>У вас пока нет заданий</p>
        <Button label="Найти практику" @click="router.push('/vacancies')" />
      </div>

      <div v-else class="tasks-list">
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <div class="task-header">
            <div class="task-title">
              <h3>{{ task.title }}</h3>
              <div class="task-meta">
                <span><i class="pi pi-calendar"></i> Срок: {{ formatDate(task.deadline) }}</span>
                <span><i class="pi pi-tag"></i> {{ task.type }}</span>
                <span><i class="pi pi-check-circle"></i> {{ task.status }}</span>
              </div>
            </div>
          </div>

          <div class="task-description">
            <p>{{ task.description }}</p>
          </div>

          <div class="task-actions">
            <Button 
              v-if="task.status === 'ожидает выполнения'"
              label="Отправить решение" 
              icon="pi pi-send"
              @click="showResponseForm(task)"
            />
            <div v-else-if="task.status === 'в процессе проверки'" class="status-sent">
              <i class="pi pi-check-circle"></i>
              В процессе проверки
            </div>
            <div v-else-if="task.status === 'выполнено'" class="status-completed">
              <i class="pi pi-check-circle"></i>
              Выполнено
            </div>
          </div>

          <div v-if="task.response" class="task-response">
            <div class="response-header">
              <h4>Ваше решение</h4>
              <span class="response-date">
                Отправлено: {{ formatDate(task.response.submitted_at) }}
              </span>
            </div>
            <div class="response-content">
              <p>{{ task.response.content }}</p>
              <div v-if="task.response.file" class="response-file">
                <i class="pi pi-file"></i>
                <a :href="task.response.file" target="_blank">Скачать прикрепленный файл</a>
              </div>
            </div>
            <div v-if="task.response.feedback" class="response-feedback">
              <h5>Обратная связь:</h5>
              <p>{{ task.response.feedback }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Dialog 
      v-model:visible="showDialog" 
      :header="selectedTask ? 'Отправить решение' : ''"
      :style="{width: '50vw'}"
      :modal="true"
    >
      <div v-if="selectedTask" class="response-form">
        <div class="form-group">
          <label for="response">Ваше решение:</label>
          <Textarea 
            id="response" 
            v-model="responseContent" 
            rows="5" 
            class="w-full"
            :disabled="selectedTask.status === 'в процессе проверки'"
          />
        </div>
        
        <div v-if="selectedTask.status === 'ожидает выполнения'" class="form-group">
          <label>Прикрепить файл:</label>
          <FileUpload
            mode="basic"
            :auto="false"
            accept=".pdf,.doc,.docx"
            :maxFileSize="5000000"
            chooseLabel="Выбрать файл"
            @select="onFileSelect"
            :customUpload="true"
            :uploadHandler="uploadFile"
            :showUploadButton="false"
            :showCancelButton="true"
          />
          <small class="p-text-secondary">
            Поддерживаемые форматы: PDF, DOC, DOCX. Максимальный размер: 5MB
          </small>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Отмена" 
          icon="pi pi-times" 
          @click="closeDialog" 
          class="p-button-text"
        />
        <Button 
          v-if="selectedTask?.status === 'ожидает выполнения'"
          label="Отправить" 
          icon="pi pi-send" 
          @click="submitResponse" 
          :loading="submitting"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Tag, Textarea, FileUpload, Dialog, Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const showDialog = ref(false);
const selectedTask = ref(null);
const responseContent = ref('');
const selectedFile = ref(null);
const submitting = ref(false);

const tasks = ref([
  {
    id: 1,
    title: 'Разработка API',
    description: 'Создать REST API для системы управления задачами',
    deadline: '2024-04-01',
    type: 'Практическое задание',
    status: 'ожидает выполнения',
    response: null
  },
  {
    id: 2,
    title: 'Тестирование',
    description: 'Написать unit-тесты для существующего кода',
    deadline: '2024-04-15',
    type: 'Тестовое задание',
    status: 'выполнено',
    response: {
      id: 1,
      content: 'Я написал тесты для основных компонентов...',
      file: '#',
      submitted_at: '2024-03-20T10:00:00',
      feedback: 'Отличная работа!'
    }
  }
]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

const showResponseForm = (task) => {
  selectedTask.value = task;
  responseContent.value = task.response?.content || '';
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedTask.value = null;
  responseContent.value = '';
  selectedFile.value = null;
};

const onFileSelect = (event) => {
  selectedFile.value = event.files[0];
};

const uploadFile = () => {
  // В реальном приложении здесь будет загрузка файла
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

const submitResponse = async () => {
  if (!responseContent.value.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Пожалуйста, введите решение',
      life: 3000
    });
    return;
  }

  submitting.value = true;
  try {
    // В реальном приложении здесь будет API-запрос
    const response = {
      id: Date.now(),
      content: responseContent.value,
      file: selectedFile.value ? URL.createObjectURL(selectedFile.value) : null,
      submitted_at: new Date().toISOString(),
      status: 'в процессе проверки'
    };

    // Обновляем задание в списке
    const taskIndex = tasks.value.findIndex(t => t.id === selectedTask.value.id);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].response = response;
      tasks.value[taskIndex].status = 'в процессе проверки';
    }

    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Решение успешно отправлено',
      life: 3000
    });

    closeDialog();
  } catch (error) {
    console.error('Ошибка при отправке решения:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось отправить решение',
      life: 3000
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.student-tasks {
  padding: 2rem;
}

.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tasks-container h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.no-tasks {
  text-align: center;
  padding: 3rem;
  background: var(--surface-card);
  border-radius: 8px;
  border: 1px solid var(--surface-border);
}

.no-tasks p {
  margin-bottom: 1rem;
  color: var(--text-color-secondary);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid var(--surface-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transform: translateY(-3px);
  border-color: var(--primary-color);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--surface-border);
}

.task-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.task-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;
  color: var(--text-color-secondary);
  font-size: 1rem;
}

.task-description {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
}

.task-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid var(--surface-border);
}

.status-sent {
  color: var(--green-500);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-sent i {
  font-size: 1rem;
}

.status-completed {
  color: var(--green-600);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-completed i {
  font-size: 1rem;
}

.task-response {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--surface-ground);
  border-radius: 8px;
  border: 2px solid var(--surface-border);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.response-date {
  color: var(--text-color-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.response-content {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 6px;
  border: 2px solid var(--surface-border);
}

.response-feedback {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--surface-hover);
  border-radius: 6px;
  font-style: italic;
  color: var(--text-color-secondary);
  border: 1px solid var(--surface-border);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.response-file {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.response-file i {
  color: var(--primary-color);
}

.response-file a {
  color: var(--primary-color);
  text-decoration: none;
}

.response-file a:hover {
  text-decoration: underline;
}
</style> 