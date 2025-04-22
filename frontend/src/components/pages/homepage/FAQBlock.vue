<template>
  <div class="container">
    <Accordion
      value="0"
      expandIcon="pi pi-plus"
      collapseIcon="pi pi-minus accordion-section"
    >
      <AccordionPanel
        v-for="(faqElement, index) in faqList"
        key="index"
        :value="index"
      >
        <AccordionHeader>
          <span class="flex items-center gap-2 w-full">
            <Avatar
              :image="
                isDarkTheme ? '/images/logo-dark.png' : '/images/logo.png'
              "
              shape="circle"
            />
            <span class="font-bold whitespace-nowrap">{{
              faqElement.question
            }}</span>
          </span>
        </AccordionHeader>
        <AccordionContent>
          <p>
            {{ faqElement.answer }}
          </p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from "primevue";
import Avatar from "primevue/avatar";
import { onMounted, onUnmounted, ref } from "vue";

const faqList = ref([
  {
    question: "Как найти стажировку, которая соответствует моей специальности?",
    answer:
      "Используйте фильтры по направлениям и ключевым навыкам. Заполните профиль максимально подробно — это поможет системе подобрать подходящие вакансии.",
  },
  {
    question: "Нужно ли иметь опыт, чтобы пройти на стажировку?",
    answer:
      "Нет. Стажировки предназначены именно для получения первого опыта. Однако наличие портфолио или учебных проектов повысит ваши шансы.",
  },
  {
    question: "Что делать, если не получаю откликов от работодателей?",
    answer:
      "Проверьте актуальность резюме, дополните его, пройдите рекомендованные тесты на платформе и попробуйте откликнуться на более широкий круг вакансий.",
  },
  {
    question: "Как подготовиться к онлайн-собеседованию?",
    answer:
      "Убедитесь, что ваша техника работает исправно. Ознакомьтесь с деятельностью компании, подготовьте краткий рассказ о себе и возможные вопросы.",
  },
  {
    question: "Зачем проходить тестирование на платформе?",
    answer:
      "Это помогает работодателю понять ваш уровень подготовки. А вам — выделиться среди других кандидатов.",
  },
  {
    question: "Можно ли проходить стажировку удалённо?",
    answer:
      "Да, многие компании предлагают удалённые или гибридные форматы. Такие предложения будут отмечены при поиске.",
  },
  {
    question: "Могу ли я пройти стажировку через университет?",
    answer:
      "Да, многие вузы сотрудничают с работодателями. Но платформа 'Практис' расширяет ваши возможности за счёт прямых контактов с компаниями.",
  },
]);

function useThemeWatcher() {
  const isDarkTheme = ref(false);

  const observer = new MutationObserver(() => {
    isDarkTheme.value = document.documentElement.classList.contains("dark");
  });

  onMounted(() => {
    isDarkTheme.value = document.documentElement.classList.contains("dark");
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  onUnmounted(() => {
    observer.disconnect();
  });

  return { isDarkTheme };
}

const { isDarkTheme } = useThemeWatcher();
</script>
<style>
.p-accordion {
  width: 100%;
}

.dark .p-accordionheader,
.dark .p-accordioncontent-content {
  background-color: #282828 !important;
}

.dark .p-accordionheader-toggle-icon.pi:before {
  color: #fff;
}

.dark .p-accordionheader {
  color: #fff !important;
}
</style>
