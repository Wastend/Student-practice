<template>
  <section class="vacancy-header">
    <div class="container">
      <div class="vacancy-header-wrap">
        <Card class="vacancy-card">
          <template #title>
            <div class="vacancy-title-wrap">
              <h1 class="vacancy-title">{{ title }}</h1>
              <div class="vacancy-meta vacancy-meta-top">
                <div class="company-info">
                  <span class="company">{{ typeof company === 'object' ? company.company_name : company }}</span>
                  <span class="location">{{ location }}</span>
                </div>
                <div class="vacancy-details">
                  <span class="job-type">{{ jobType === 'practice' ? 'Практика' : 'Стажировка' }}</span>
                  <span class="date">Опубликовано: {{ formatDate(posted_at) }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #content>
            <div class="vacancy-meta">
              <Tag v-if="category" class="vacancy-category" severity="info">{{ getCategoryName(category) }}</Tag>
              <Tag v-if="location" class="vacancy-location" severity="success">{{ location }}</Tag>
              <Tag v-if="company?.name" class="vacancy-company" severity="warning">{{ company.name }}</Tag>
              <Tag v-if="remote" class="vacancy-remote" severity="info">Удаленная работа</Tag>
            </div>
            <div class="vacancy-actions">
              <template v-if="isAuthenticated">
                <template v-if="userRole === 1">
                  <template v-if="has_applied">
                    <div class="application-status" :class="application_status">
                      {{ getStatusText(application_status) }}
                    </div>
                  </template>
                  <template v-else>
                    <template v-if="test_id">
                      <Button
                        v-if="!hasPassedTest"
                        label="Пройти тест"
                        class="btn-primary"
                        @click="goToTest"
                      />
                      <Button
                        v-else
                        label="Откликнуться"
                        class="btn-primary"
                        @click="applyForVacancy"
                      />
                    </template>
                    <Button
                      v-else
                      label="Откликнуться"
                      class="btn-primary"
                      @click="applyForVacancy"
                    />
                  </template>
                </template>
                <template v-else-if="userRole === 2">
                  <Button
                    label="Откликнуться"
                    class="btn-primary"
                    @click="showCompanyWarning"
                    disabled
                  />
                </template>
              </template>
              <template v-else>
                <Button
                  label="Откликнуться"
                  class="btn-primary"
                  @click="showAuthWarning"
                />
              </template>
            </div>
            <div class="vacancy-tags" v-if="tags && tags.length">
              <Tag v-for="tag in tags" :key="tag.id" class="vacancy-tag" severity="help">
                {{ tag.name }}
              </Tag>
            </div>
            <div class="vacancy-description" v-if="description">
              <h2 class="description-title">Описание</h2>
              <p class="description-text">{{ description }}</p>
            </div>
            <div class="vacancy-responsibilities" v-if="responsibilities && responsibilities.length">
              <h2 class="description-title">Обязанности</h2>
              <ul class="list">
                <li v-for="(item, index) in responsibilities" :key="index" class="list-item">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <div class="vacancy-requirements" v-if="requirements && requirements.length">
              <h2 class="description-title">Требования</h2>
              <ul class="list">
                <li v-for="(item, index) in requirements" :key="index" class="list-item">
                  {{ item.text }}
                </li>
              </ul>
            </div>
            <div class="vacancy-benefits" v-if="benefits">
              <h2 class="description-title">Преимущества</h2>
              <p class="description-text">{{ benefits }}</p>
            </div>
            <div class="vacancy-conditions" v-if="hasConditions">
              <h2 class="description-title">Условия работы</h2>
              <div class="conditions-grid">
                <div class="condition-item" v-if="work_schedule">
                  <i class="pi pi-clock"></i>
                  <span>{{ getWorkScheduleName(work_schedule) }}</span>
                </div>
                <div class="condition-item" v-if="employment_type">
                  <i class="pi pi-briefcase"></i>
                  <span>{{ getEmploymentTypeName(employment_type) }}</span>
                </div>
                <div class="condition-item" v-if="experience_level">
                  <i class="pi pi-star"></i>
                  <span>{{ getExperienceLevelName(experience_level) }}</span>
                </div>
                <div class="condition-item" v-if="education_level">
                  <i class="pi pi-graduation-cap"></i>
                  <span>{{ getEducationLevelName(education_level) }}</span>
                </div>
                <div class="condition-item salary" v-if="salary">
                  <i class="pi pi-money-bill"></i>
                  <span>{{ formatSalary(salary) }} ₽</span>
                </div>
              </div>
            </div>
            <div class="vacancy-additional-conditions" v-if="hasAdditionalConditions">
              <h2 class="description-title">Дополнительные условия</h2>
              <div class="conditions-grid">
                <div v-if="mentor_support" class="condition-item">
                  <i class="pi pi-user-plus"></i>
                  <span>Поддержка ментора</span>
                </div>
                <div v-if="certificate" class="condition-item">
                  <i class="pi pi-id-card"></i>
                  <span>Сертификат по окончании</span>
                </div>
                <div v-if="possibility_of_employment" class="condition-item">
                  <i class="pi pi-briefcase"></i>
                  <span>Возможность трудоустройства</span>
                </div>
                <div v-if="paid" class="condition-item">
                  <i class="pi pi-money-bill"></i>
                  <span>Оплачиваемая стажировка</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Card, Tag, Button } from "primevue";
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from 'vue';
import { getTags } from "@/api/index";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";
import axios from 'axios';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const availableTags = ref([]);
const hasPassedTest = ref(false);

// Отладочная информация
console.log('Auth Store State:', {
  user: authStore.user,
  token: authStore.token,
  isAuthenticated: authStore.isAuthenticated,
  userRole: authStore.user?.role
});

// Проверяем состояние при монтировании компонента
onMounted(() => {
  console.log('Component Mounted - Auth State:', {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.user?.role
  });
});

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    default: ''
  },
  location: {
    type: String,
    required: true,
    default: ''
  },
  company: {
    type: Object,
    default: () => ({})
  },
  description: {
    type: String,
    default: ''
  },
  responsibilities: {
    type: Array,
    default: () => []
  },
  requirements: {
    type: Array,
    default: () => []
  },
  salary: {
    type: [Number, String],
    required: true,
    default: 0
  },
  remote: {
    type: [Boolean, Number],
    required: true,
    default: false
  },
  test_id: {
    type: [String, Number],
    default: null
  },
  tags: {
    type: Array,
    default: () => []
  },
  work_schedule: {
    type: String,
    default: ''
  },
  employment_type: {
    type: String,
    default: ''
  },
  experience_level: {
    type: String,
    default: ''
  },
  education_level: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  mentor_support: {
    type: [Boolean, Number],
    required: true,
    default: false
  },
  certificate: {
    type: [Boolean, Number],
    required: true,
    default: false
  },
  possibility_of_employment: {
    type: [Boolean, Number],
    required: true,
    default: false
  },
  paid: {
    type: [Boolean, Number],
    required: true,
    default: false
  },
  vacancyId: {
    type: [String, Number],
    default: null
  },
  has_applied: {
    type: Boolean,
    default: false
  },
  application_status: {
    type: String,
    default: ''
  },
  posted_at: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    default: ''
  },
  vacancy: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const getTagName = (tagId) => {
  const tag = availableTags.value.find(t => t.id === tagId);
  return tag ? tag.name : '';
};

onMounted(async () => {
  try {
    availableTags.value = await getTags();
  } catch (error) {
    console.error('Ошибка при загрузке тегов:', error);
  }
});

const hasConditions = computed(() => {
  return props.work_schedule || props.employment_type || props.experience_level || props.education_level;
});

const hasAdditionalConditions = computed(() => {
  return props.mentor_support || props.certificate || props.possibility_of_employment || props.paid;
});

const goToTest = () => {
  if (props.test_id) {
    router.push(`/tests/${props.test_id}/take`);
  }
};

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.user?.role);

// Добавляем отладочную информацию
console.log('Auth State in VacancyHeader:', {
  isAuthenticated: isAuthenticated.value,
  userRole: userRole.value,
  user: authStore.user
});

const showCompanyWarning = () => {
  toast.add({
    severity: 'warn',
    summary: 'Внимание',
    detail: 'Откликаться на вакансии могут только студенты',
    life: 3000
  });
};

const showAuthWarning = () => {
  toast.add({
    severity: 'info',
    summary: 'Требуется авторизация',
    detail: 'Для отклика на вакансию необходимо авторизоваться',
    life: 3000
  });
};

const applyForVacancy = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/api/jobs/${props.vacancyId}/apply`, {
      userId: authStore.user.id
    });
    
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Ваш отклик успешно отправлен',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось отправить отклик',
      life: 3000
    });
  }
};

// Преобразуем числовые значения в булевы
const isRemote = computed(() => Boolean(props.remote));
const hasMentorSupport = computed(() => Boolean(props.mentor_support));
const hasCertificate = computed(() => Boolean(props.certificate));
const hasEmploymentPossibility = computed(() => Boolean(props.possibility_of_employment));
const isPaid = computed(() => Boolean(props.paid));

// Преобразуем строковую зарплату в число
const formattedSalary = computed(() => {
  if (typeof props.salary === 'string') {
    return parseFloat(props.salary);
  }
  return props.salary;
});

const getStatusText = (status) => {
  const statusMap = {
    'applied': 'Отклик отправлен',
    'interview': 'Приглашение на собеседование',
    'rejected': 'Отклонено',
    'accepted': 'Принято'
  };
  return statusMap[status] || status;
};

const getWorkScheduleName = (schedule) => {
  const schedules = {
    'full_time': 'Полный день',
    'part_time': 'Частичная занятость',
    'flexible': 'Гибкий график'
  };
  return schedules[schedule] || schedule;
};

const getEmploymentTypeName = (type) => {
  const types = {
    'full_time': 'Полная занятость',
    'part_time': 'Частичная занятость',
    'project': 'Проектная работа',
    'internship': 'Стажировка'
  };
  return types[type] || type;
};

const getExperienceLevelName = (level) => {
  const levels = {
    'no_experience': 'Без опыта',
    'less_than_year': 'До 1 года',
    '1-3_years': '1-3 года',
    '3-5_years': '3-5 лет',
    'more_than_5_years': 'Более 5 лет'
  };
  return levels[level] || level;
};

const getEducationLevelName = (level) => {
  const levels = {
    'secondary': 'Среднее образование',
    'bachelor': 'Бакалавриат',
    'master': 'Магистратура',
    'phd': 'Аспирантура'
  };
  return levels[level] || level;
};

const formatSalary = (salary) => {
  return new Intl.NumberFormat('ru-RU').format(salary);
};

const getCategoryName = (category) => {
  const categories = {
    'development': 'Разработка',
    'design': 'Дизайн',
    'marketing': 'Маркетинг',
    'management': 'Менеджмент',
    'sales': 'Продажи',
    'support': 'Поддержка',
    'other': 'Другое'
  };
  return categories[category] || category;
};

const formatDate = (dateString) => {
  console.log('Received date string:', dateString);
  
  if (!dateString) {
    console.log('Date string is empty');
    return 'Дата не указана';
  }
  
  try {
    const date = new Date(dateString);
    console.log('Parsed date:', date);
    
    if (isNaN(date.getTime())) {
      console.log('Invalid date');
      return 'Некорректная дата';
    }
    
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    };
    
    const formattedDate = new Intl.DateTimeFormat('ru-RU', options).format(date);
    console.log('Formatted date:', formattedDate);
    return formattedDate;
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Ошибка форматирования даты';
  }
};

// Добавляем отладочную информацию при монтировании компонента
onMounted(() => {
  console.log('Vacancy props:', {
    posted_at: props.posted_at,
    jobType: props.jobType,
    company: props.company
  });
});
</script>

<style scoped>
.vacancy-header,
.vacancy-header-wrap {
  width: 100%;
}

.vacancy-card {
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.vacancy-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.vacancy-title-wrap {
  margin-bottom: 2rem;
}

.vacancy-meta {
  display: flex;
  gap: 1rem;
}

.vacancy-meta.vacancy-meta-top {
  align-items: flex-start;
  justify-content: space-between;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.company {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.vacancy-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.job-type {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  text-align: center;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.vacancy-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.vacancy-category,
.vacancy-location,
.vacancy-company {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.vacancy-description {
  margin-top: 2rem;
}

.description-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  color: var(--primary-color);
}

.description-text {
  white-space: pre-line;
  line-height: 1.5;
  color: var(--text-color);
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  color: var(--text-color);
}

.list-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
  color: var(--text-color);
}

.condition-item i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.condition-item.salary {
  color: var(--primary-color);
  font-weight: 500;
}

.benefits {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.benefits h3 {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.vacancy-additional-conditions {
  margin-top: 2rem;
}

.vacancy-actions {
  margin: 1.5rem 0;
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
}

.btn-primary {
  min-width: 200px;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-600);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.application-status {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-align: center;
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

.vacancy-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
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

.detail-item.salary {
  color: var(--primary-color);
  font-weight: 500;
}

.vacancy-benefits {
  margin: 1.5rem 0;
  background-color: var(--surface-ground);
  border-radius: 8px;
}

.vacancy-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--surface-ground);
  border-radius: 4px;
}

.feature i {
  color: var(--primary-color);
}
</style>
