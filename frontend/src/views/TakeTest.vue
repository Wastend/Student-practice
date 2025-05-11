<template>
    <section class="take-test">
        <h2>{{ test.title }}</h2>
        <form @submit.prevent="handleSubmit">
            <div v-for="(question, index) in test.questions" :key="index">
                <h3>{{ question.text }}</h3>
                <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
                    <input
                        type="radio"
                        :name="'question-' + index"
                        :value="answer.id"
                        v-model="answers[index]"
                    />
                    {{ answer.text }}
                </div>
            </div>
            <button type="submit">Отправить</button>
        </form>
        <div class="test-results">
            <h3>Результаты тестов</h3>
            <ul>
                <li v-for="result in testResults" :key="result.id">
                    {{ result.test_title }}: {{ result.score }} баллов
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTestById, submitTest } from "@/api";
import { useRouter, useRoute } from "vue-router";

const test = ref({});
const answers = ref([]);
const userAnswers = ref([]);
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    const testId = route.params.id;
    test.value = await getTestById(testId);
    userAnswers.value = Array(test.value.questions.length).fill(null);
  } catch (error) {
    console.error("Ошибка при загрузке теста:", error);
    alert("Не удалось загрузить тест");
    router.push("/vacancies");
  }
});

const handleSubmit = async () => {
    const result = await submitTest(route.params.id, answers.value);
    alert(`Ваш результат: ${result.score}`);
};
</script>