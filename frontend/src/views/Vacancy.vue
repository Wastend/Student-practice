<template>
  <div v-if="loading" class="loader">Загрузка...</div>
  <div v-else>
    <div class="breadcrumbs">
      <div class="container">
        <div class="breadcrumbs-wrap">
          <Breadcrumb :home="home" :model="breadcrumbs" />
        </div>
      </div>
    </div>
    <VacancyHeader
      :title="vacancy.title"
      :category="vacancy.category || 'IT'"
      :location="vacancy.location || 'Не указано'"
      :company="{ name: vacancy.company_name || 'Не указано', description: vacancy.company_description || '', website: vacancy.company_website || '' }"
      :description="vacancy.description"
      :testId="vacancy.test_id"
    />
    <VacancyInfo
      :responsibilities="[
        'Участие в разработке и поддержке веб-приложений',
        'Верстка пользовательских интерфейсов (HTML, CSS)',
        'Работа с JavaScript и библиотеками (например, Vue.js или React)',
        'Тестирование и отладка кода',
        'Участие в командных встречах и планировании задач'
      ]"
      :requirements="[
        'Базовые знания HTML, CSS, JavaScript',
        'Желание развиваться в сфере веб-разработки',
        'Ответственность и готовность учиться',
        'Умение работать в команде',
        'Будет плюсом: знание одного из фреймворков (Vue, React), опыт с Git'
      ]"
      :conditions="{
        duration: '3 месяца',
        schedule: 'Гибкий график (возможность совмещать с учёбой)',
        mentorSupport: true,
        certificate: true,
        possibilityOfEmployment: true,
        paid: vacancy.salary > 0
      }"
    />
    <FAQBlock />
  </div>
</template>
<script setup>
import FAQBlock from "@/components/pages/homepage/FAQBlock.vue";
import VacancyHeader from "@/components/pages/vacancy/VacancyHeader.vue";
import VacancyInfo from "@/components/pages/vacancy/VacancyInfo.vue";
import { Breadcrumb } from "primevue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobById } from "@/api";

const route = useRoute();
const router = useRouter();
const vacancy = ref(null);
const loading = ref(true);

const home = ref({
  icon: "pi pi-home",
  route: "/",
});

const breadcrumbs = ref([]);

onMounted(async () => {
  try {
    const vacancyId = route.params.id;
    vacancy.value = await getJobById(vacancyId);

    // Устанавливаем хлебные крошки
    breadcrumbs.value = [
      { label: "Вакансии", route: "/vacancies" },
      { label: vacancy.value.title },
    ];
  } catch (error) {
    console.error("Ошибка при загрузке вакансии:", error);
    alert("Не удалось загрузить данные вакансии");
  } finally {
    loading.value = false;
  }
});
</script>
<style>
.breadcrumbs {
  width: 100%;
}

.breadcrumbs-wrap {
  display: flex;
  width: 100%;
}

.p-breadcrumb {
  background-color: transparent !important;
  margin-top: -40px;
}

.p-breadcrumb-item,
.p-breadcrumb-item span {
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  color: var(--text-color);
}

.p-breadcrumb-item:hover,
.p-breadcrumb-item span:hover {
  color: var(--primary-color);
}
</style>
