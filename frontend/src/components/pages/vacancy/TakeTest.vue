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
        <div v-if="user.role_id === 1" class="test-results">
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

const test = ref({});
const answers = ref([]);
const testId = 1; // Замените на динамическое значение

onMounted(async () => {
    test.value = await getTestById(testId);
});

const handleSubmit = async () => {
    const result = await submitTest(testId, answers.value);
    alert(`Ваш результат: ${result.score}`);
};
</script>