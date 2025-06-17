<template>
  <div class="vacancy-tasks-page">
    <h2>Управление заданиями для вакансии</h2>
    <div class="vacancy-info">
      <h3>{{ vacancy.title }}</h3>
      <p>{{ vacancy.description }}</p>
    </div>
    <div class="tasks-section">
      <div class="tasks-header">
        <h4>Задания</h4>
        <Button icon="pi pi-plus" class="p-button-success" style="width: 170px;" @click="showTaskForm = true">
          Добавить задание
        </Button>
      </div>
      <div v-if="tasks.length === 0" class="no-tasks">Задания не добавлены.</div>
      <ul v-else class="tasks-list">
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-card">
            <div class="task-header">
              <strong>{{ task.title }}</strong>
              <span class="task-type">{{ task.type }}</span>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-details">
              <span class="task-deadline">
                <i class="pi pi-calendar"></i>
                Дедлайн: {{ task.deadline ? new Date(task.deadline).toLocaleDateString() : 'не указан' }}
              </span>
              <span class="task-criteria">
                <i class="pi pi-list"></i>
                Критерии: {{ task.criteria }}
              </span>
            </div>
          </div>
          <div class="task-actions">
            <Button class="p-button-text" @click="editTask(task)">
              <i class="pi pi-pencil"></i>
            </Button>
            <Button class="p-button-text p-button-danger" @click="deleteTask(task.id)">
              <i class="pi pi-trash"></i>
            </Button>
          </div>
        </li>
      </ul>
    </div>
    <Dialog v-model:visible="showTaskForm" header="Добавить/Редактировать задание" :modal="true" :closable="true" :style="{ width: '800px' }">
      <form @submit.prevent="submitTask">
        <div class="p-field">
          <label>Название</label>
          <InputText v-model="taskForm.title" required />
        </div>
        <div class="p-field">
          <label>Описание</label>
          <Textarea v-model="taskForm.description" autoResize required />
        </div>
        <div class="p-field">
          <label>Дедлайн</label>
          <InputText v-model="taskForm.deadline" type="date" />
        </div>
        <div class="p-field">
          <label>Тип</label>
          <Dropdown v-model="taskForm.type" :options="taskTypes" placeholder="Выберите тип задания" />
        </div>
        <div class="p-field">
          <label>Критерии оценки</label>
          <Textarea v-model="taskForm.criteria" autoResize />
        </div>
        <div class="p-field">
          <label>Файл (опционально)</label>
          <input type="file" @change="onFileChange" />
        </div>
        <div class="dialog-actions">
          <Button type="submit" class="p-button-success">
            <i class="pi pi-check"></i>
            Сохранить
          </Button>
          <Button class="p-button-text" @click="showTaskForm = false">
            <i class="pi pi-times"></i>
            Отмена
          </Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Dialog, InputText, Textarea, Dropdown } from 'primevue';

const route = useRoute();
const vacancyId = route.params.id;

// Тестовые данные
const vacancy = ref({
  id: vacancyId,
  title: 'Frontend разработчик',
  description: 'Стажировка для начинающих разработчиков'
});

const taskTypes = [
  'Практическое задание',
  'Техническое задание',
  'Тестовое задание',
  'Домашнее задание'
];

const tasks = ref([
  {
    id: 1,
    title: 'Создание компонента',
    description: 'Разработать компонент на Vue.js с использованием Composition API',
    deadline: '2024-04-01',
    type: 'Практическое задание',
    criteria: 'Чистый код, документация, типизация'
  },
  {
    id: 2,
    title: 'Работа с API',
    description: 'Интеграция с REST API, обработка ошибок, оптимизация запросов',
    deadline: '2024-04-15',
    type: 'Техническое задание',
    criteria: 'Обработка ошибок, оптимизация, безопасность'
  },
  {
    id: 3,
    title: 'Тестирование компонентов',
    description: 'Написание unit-тестов для компонентов Vue.js',
    deadline: '2024-04-20',
    type: 'Тестовое задание',
    criteria: 'Покрытие тестами, качество тестов'
  }
]);

const showTaskForm = ref(false);
const editingTaskId = ref(null);
const taskForm = reactive({
  title: '',
  description: '',
  deadline: '',
  type: '',
  criteria: '',
  file: null
});

const submitTask = () => {
  if (editingTaskId.value) {
    const index = tasks.value.findIndex(t => t.id === editingTaskId.value);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...taskForm };
    }
  } else {
    tasks.value.push({
      id: Date.now(),
      ...taskForm
    });
  }
  showTaskForm.value = false;
  resetForm();
};

const editTask = (task) => {
  editingTaskId.value = task.id;
  Object.assign(taskForm, task);
  showTaskForm.value = true;
};

const deleteTask = (id) => {
  if (confirm('Удалить задание?')) {
    tasks.value = tasks.value.filter(t => t.id !== id);
  }
};

const onFileChange = (e) => {
  taskForm.file = e.target.files[0];
};

const resetForm = () => {
  editingTaskId.value = null;
  taskForm.title = '';
  taskForm.description = '';
  taskForm.deadline = '';
  taskForm.type = '';
  taskForm.criteria = '';
  taskForm.file = null;
};
</script>

<style scoped>
.vacancy-tasks-page {
  max-width: 900px;
  margin: 2rem auto;
  background: var(--surface-card);
  border-radius: 8px;
  padding: 2rem;
}

.vacancy-info {
  margin-bottom: 2rem;
}

.p-textarea-resizable {
  width: 100%;
}

.tasks-section {
  margin-bottom: 2rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tasks-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  margin-bottom: 1rem;
  background: var(--surface-ground);
}

.task-content {
  flex: 1;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.task-type {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  background: var(--surface-hover);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.task-description {
  margin: 0.5rem 0;
  color: var(--text-color-secondary);
}

.task-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.task-details i {
  margin-right: 0.25rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.no-tasks {
  color: var(--text-color-secondary);
  margin: 1rem 0;
  text-align: center;
  padding: 2rem;
  background: var(--surface-ground);
  border-radius: 6px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.p-field {
  margin-bottom: 1rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.p-button-text {
  padding: 0.5rem;
}

.p-button-text i {
  font-size: 1rem;
}
</style> 