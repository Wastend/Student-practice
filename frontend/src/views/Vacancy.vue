<template>
  <div class="vacancy-page">
    <div class="vacancy-content">
      <VacancyHeader :title="vacancy.title" :category="vacancy.category" :location="vacancy.location" :company="company"
        :description="vacancy.description" :responsibilities="vacancy.responsibilities"
        :requirements="vacancy.requirements" :salary="vacancy.salary" :remote="vacancy.remote"
        :test_id="vacancy.test_id" :tags="vacancy.tags" :work_schedule="vacancy.work_schedule"
        :employment_type="vacancy.employment_type" :experience_level="vacancy.experience_level"
        :education_level="vacancy.education_level" :benefits="vacancy.benefits"
        :mentor_support="vacancy.mentor_support"
        :certificate="vacancy.certificate"
        :possibility_of_employment="vacancy.possibility_of_employment"
        :paid="vacancy.paid"
        :vacancyId="route.params.id"
        :has_applied="vacancy.has_applied"
        :application_status="vacancy.application_status"
        :posted_at="vacancy.posted_at"
        :jobType="vacancy.job_type"
        @applied="handleApplied" />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import VacancyHeader from "@/components/pages/vacancy/VacancyHeader.vue";
  import axios from "axios";
  import { useAuthStore } from "@/stores/auth";

  const route = useRoute();
  const authStore = useAuthStore();
  const vacancy = ref({
    title: '',
    category: '',
    location: '',
    description: '',
    responsibilities: [],
    requirements: [],
    salary: 0,
    remote: false,
    test_id: null,
    tags: [],
    work_schedule: '',
    employment_type: '',
    experience_level: '',
    education_level: '',
    benefits: '',
    mentor_support: false,
    certificate: false,
    possibility_of_employment: false,
    paid: false,
    has_applied: false,
    application_status: '',
    posted_at: '',
    job_type: ''
  });
  const company = ref({});

  const fetchVacancy = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/jobs/${route.params.id}`, {
        params: {
          student_id: authStore.user?.id
        }
      });
      vacancy.value = response.data;
      console.log('Данные вакансии:', vacancy.value);

      // Получаем информацию о компании
      if (vacancy.value.employer_id) {
        const companyResponse = await axios.get(`http://localhost:3000/api/users/${vacancy.value.employer_id}`);
        company.value = companyResponse.data;
      }
    } catch (error) {
      console.error("Ошибка при загрузке вакансии:", error);
    }
  };

  const handleApplied = () => {
    // Обновляем состояние вакансии после успешного отклика
    vacancy.value.has_applied = true;
    vacancy.value.application_status = 'applied';
  };

  onMounted(() => {
    fetchVacancy();
  });
</script>

<style>
  .vacancy-page {
    padding: 2rem 0;
  }

  .vacancy-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .vacancy-actions .btn-primary {
    transition: .3s ease-in-out;
  }

  .vacancy-actions .btn-primary:hover,
  .vacancy-actions .btn-primary:active {
    background-color: #2196f3 !important;
  }
</style>