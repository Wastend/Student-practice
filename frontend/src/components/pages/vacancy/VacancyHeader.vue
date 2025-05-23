<template>
  <section class="vacancy-header">
    <div class="container">
      <div class="vacancy-header-wrap">
        <Card class="vacancy-card">
          <template #title>
            <h1 class="vacancy-title">{{ title }}</h1>
          </template>
          <template #content>
            <div class="vacancy-meta">
              <Tag v-if="category" class="vacancy-category" severity="info">{{ category }}</Tag>
              <Tag v-if="location" class="vacancy-location" severity="success">{{ location }}</Tag>
              <Tag v-if="company?.name" class="vacancy-company" severity="warning">{{ company.name }}</Tag>
              <Tag v-if="remote" class="vacancy-remote" severity="info">Удаленная работа</Tag>
            </div>
            <div class="vacancy-actions">
              <template v-if="isAuthenticated">
                <template v-if="userRole === 1">
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
            <div class="vacancy-conditions" v-if="hasConditions">
              <h2 class="description-title">Условия работы</h2>
              <div class="conditions-list">
                <div class="condition-item" v-if="work_schedule">
                  <span class="condition-label">График работы:</span>
                  <span class="condition-value">{{ work_schedule }}</span>
                </div>
                <div class="condition-item" v-if="employment_type">
                  <span class="condition-label">Тип занятости:</span>
                  <span class="condition-value">{{ employment_type }}</span>
                </div>
                <div class="condition-item" v-if="experience_level">
                  <span class="condition-label">Опыт работы:</span>
                  <span class="condition-value">{{ experience_level }}</span>
                </div>
                <div class="condition-item" v-if="education_level">
                  <span class="condition-label">Образование:</span>
                  <span class="condition-value">{{ education_level }}</span>
                </div>
              </div>
            </div>
            <div class="vacancy-benefits" v-if="benefits">
              <h2 class="description-title">Преимущества</h2>
              <p class="description-text">{{ benefits }}</p>
            </div>
            <div class="vacancy-salary" v-if="salary">
              <h2 class="description-title">Зарплата</h2>
              <p class="description-text">{{ salary }} ₽</p>
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
import { getTags } from "@/api";
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

.vacancy-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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
  padding: 0.5rem;
  background-color: var(--surface-ground);
  border-radius: 8px;
  color: var(--text-color);
}

.condition-item i {
  color: var(--primary-color);
  font-size: 1.2rem;
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
</style>
