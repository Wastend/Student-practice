<template>
  <div class="breadcrumbs">
    <div class="container">
      <div class="breadcrumbs-wrap">
        <Breadcrumb :home="home" :model="breadcrumbs">
          <template #item="{ item, props }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a :href="href" v-bind="props.action" @click="navigate">
                <span :class="[item.icon, 'text-color']" />
                <span class="text-primary font-semibold">{{ item.label }}</span>
              </a>
            </router-link>
            <a
              v-else
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
            >
              <span class="text-surface-700 dark:text-surface-0">{{
                item.label
              }}</span>
            </a>
          </template>
        </Breadcrumb>
      </div>
    </div>
  </div>
  <VacancyHeader
    :title="vacancy.title"
    :category="vacancy.category"
    :location="vacancy.location"
    :company="vacancy.company"
    :description="vacancy.description"
  />
  <VacancyInfo
    :responsibilities="vacancy.responsibilities"
    :requirements="vacancy.requirements"
    :conditions="vacancy.conditions"
  />
  <FAQBlock />
</template>
<script setup>
import FAQBlock from "@/components/pages/homepage/FAQBlock.vue";
import VacancyHeader from "@/components/pages/vacancy/VacancyHeader.vue";
import VacancyInfo from "@/components/pages/vacancy/VacancyInfo.vue";
import { Breadcrumb } from "primevue";
import { ref } from "vue";

const home = ref({
  icon: "pi pi-home",
  route: "/",
});

const vacancy = ref({
  id: 1,
  title: "Стажировка в IT-компании",
  description:
    "Стажировка для студентов и начинающих специалистов в сфере веб-разработки. Идеальный старт карьеры в IT с возможностью обучения и реального участия в проектах. Подходит тем, кто хочет развиваться в frontend или fullstack-направлении. Работа в команде с опытными наставниками.",
  responsibilities: [
    "Участие в разработке и поддержке веб-приложений",
    "Верстка пользовательских интерфейсов (HTML, CSS)",
    "Работа с JavaScript и библиотеками (например, Vue.js или React)",
    "Тестирование и отладка кода",
    "Участие в командных встречах и планировании задач",
  ],
  requirements: [
    "Базовые знания HTML, CSS, JavaScript",
    "Желание развиваться в сфере веб-разработки",
    "Ответственность и готовность учиться",
    "Умение работать в команде",
    "Будет плюсом: знание одного из фреймворков (Vue, React), опыт с Git",
  ],
  conditions: {
    duration: "3 месяца",
    schedule: "Гибкий график (возможность совмещать с учёбой)",
    mentorSupport: true,
    certificate: true,
    possibilityOfEmployment: true,
    paid: false,
  },
  category: "IT",
  location: "Москва",
  remote: false,
  company: {
    name: "TechStart",
    description:
      "TechStart — это современная IT-компания, занимающаяся разработкой цифровых продуктов для бизнеса. Мы верим в рост через практику и всегда рады новым талантам.",
    website: "https://techstart.ru",
    logo: "https://techstart.ru/logo.png",
  },
  contact: {
    email: "hr@techstart.ru",
    phone: "+7 (495) 123-45-67",
  },
  datePosted: "2025-04-20",
  deadline: "2025-05-10",
  tags: [
    "стажировка",
    "веб-разработка",
    "frontend",
    "JavaScript",
    "HTML",
    "CSS",
    "без опыта",
  ],
});

const breadcrumbs = ref([
  { label: "Вакансии", route: "/vacancies" },
  { label: vacancy.value.id },
]);
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
