<template>
  <section class="vacancies">
    <div class="container">
      <div class="vacancies-wrap">
        <h2 class="vacancies-title">Доступные вакансии</h2>
        <div v-if="vacancies.length > 0" class="vacancies-list">
          <div
            v-for="vacancy in vacancies"
            :key="vacancy.id"
            class="vacancy-card"
          >
            <div class="vacancy-top">
              <h3 class="vacancy-title">{{ vacancy.title }}</h3>
              <p class="vacancy-description">{{ vacancy.description }}</p>
            </div>

            <div class="vacancy-bottom">
              <p>{{ vacancy.company }}</p>
              <RouterLink
                :to="`/vacancies/${vacancy.id}`"
                class="btn btn-primary"
              >
                Подробнее
              </RouterLink>
            </div>
          </div>
        </div>
        <p v-else class="no-vacancies">Вакансии не найдены</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const vacancies = ref([
  {
    id: 1,
    title: "Стажировка в IT-компании",
    description:
      "Ищем стажера для работы над веб-приложениями. Знание HTML, CSS, JavaScript приветствуется. Участие в реальных проектах под руководством наставника.",
    category: "IT",
    location: "Москва",
    company: "TechStart",
    remote: false,
  },
  {
    id: 2,
    title: "Аналитик данных (практика)",
    description:
      "Работа с Excel, Power BI, SQL. Разработка отчетов, визуализация данных, участие в аналитике бизнес-процессов. Подходит студентам тех. и экон. направлений.",
    category: "Аналитика",
    location: "Санкт-Петербург",
    company: "DataVision",
    remote: true,
  },
  {
    id: 3,
    title: "Маркетинг и PR (стажировка)",
    description:
      "Участие в создании контент-планов, анализ аудитории, помощь в ведении соцсетей. Опыт не обязателен. Гибкий график, удалёнка.",
    category: "Маркетинг",
    location: "Удалённо",
    company: "CreativeLab",
    remote: true,
  },
  {
    id: 4,
    title: "Frontend-разработчик (React/Vue)",
    description:
      "Стажировка в команде разработки. Работа с UI-компонентами, взаимодействие с API, участие в планировании спринтов.",
    category: "IT",
    location: "Новосибирск",
    company: "FrontendFox",
    remote: false,
  },
  {
    id: 5,
    title: "Backend-разработчик (Node.js)",
    description:
      "Разработка серверной логики, подключение баз данных (MongoDB, MySQL). Введение в архитектуру REST API. Git, Docker — плюсы.",
    category: "IT",
    location: "Казань",
    company: "Backengine",
    remote: true,
  },
  {
    id: 6,
    title: "UX/UI-дизайнер (практика)",
    description:
      "Создание макетов интерфейсов в Figma, участие в проектировании пользовательского опыта. Работа в связке с разработкой.",
    category: "Дизайн",
    location: "Екатеринбург",
    company: "InterfaceLab",
    remote: false,
  },
  {
    id: 7,
    title: "Ассистент в HR-отдел (стажировка)",
    description:
      "Поддержка HR-команды: обзвон кандидатов, помощь в организации собеседований, оформление документов. Обучение на месте.",
    category: "HR",
    location: "Москва",
    company: "PeopleTeam",
    remote: false,
  },
  {
    id: 8,
    title: "Стажер в отделе технической поддержки",
    description:
      "Прием обращений от пользователей, участие в обработке тикетов, обучение работе с CRM-системами и продуктами компании.",
    category: "Поддержка",
    location: "Воронеж",
    company: "HelpDeskPro",
    remote: false,
  },
  {
    id: 9,
    title: "Тестировщик ПО (QA Intern)",
    description:
      "Ручное тестирование веб- и мобильных приложений. Создание баг-репортов, проверка юзкейсов. Возможность дальнейшего трудоустройства.",
    category: "QA",
    location: "Нижний Новгород",
    company: "Testify",
    remote: true,
  },
  {
    id: 10,
    title: "Стажировка в стартапе (универсальная)",
    description:
      "Помощь в нескольких направлениях: маркетинг, IT, поддержка клиентов. Отличный шанс поработать в гибкой и динамичной среде.",
    category: "Стартап",
    location: "Удалённо",
    company: "LaunchUp",
    remote: true,
  },
  {
    id: 11,
    title: "Юридическая практика (дистанционно)",
    description:
      "Анализ правовых документов, подготовка юридических заключений, изучение трудового и гражданского права. Поддержка опытного куратора.",
    category: "Юриспруденция",
    location: "Удалённо",
    company: "LexOnline",
    remote: true,
  },
  {
    id: 12,
    title: "Журналист / Копирайтер (практика)",
    description:
      "Написание новостей, интервью, блогов. Работа с редактором. Возможность публикации на сайте партнёров.",
    category: "Контент",
    location: "Ростов-на-Дону",
    company: "NewsNext",
    remote: true,
  },
]);
</script>

<style scoped>
.vacancies {
  padding: 2rem 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

.vacancies-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancies-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--primary-color);
}

.vacancies-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.vacancy-card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
  background-color: var(--surface-ground);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.vacancy-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.vacancy-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.vacancy-description {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.no-vacancies {
  text-align: center;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.vacancy-bottom p {
  margin: 0;
}

.vacancy-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
