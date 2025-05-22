<template>
    <section class="take-test">
        <div class="container">
            <ProgressSpinner v-if="isLoading" style="width:50px;height:50px;display:block;margin:40px auto;" />
            <Card v-else class="test-card">
                <template #title>
                    <h2>{{ test.title }}</h2>
                </template>
                <template #content>
                    <form v-if="!isSubmitted" @submit.prevent="handleSubmit">
                        <div v-for="(question, index) in test.questions" :key="index" class="question-block">
                            <h3>Вопрос {{ index + 1 }}: {{ question.text }}</h3>
                            <div class="answers">
                                <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="answer-option">
                                    <RadioButton
                                        :name="'question-' + index"
                                        :value="answer.id"
                                        v-model="answers[index]"
                                        :inputId="'answer-' + index + '-' + answerIndex"
                                    />
                                    <label :for="'answer-' + index + '-' + answerIndex">{{ answer.text }}</label>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" label="Отправить" class="btn-primary mt-3" :disabled="isSubmitting" />
                    </form>
                    <div v-else class="test-results">
                        <h3>Результаты теста</h3>
                        <p>Ваш результат: {{ testResult.score }} баллов</p>
                        <Button label="Вернуться к вакансии" class="btn-primary mt-2" @click="goBack" />
                    </div>
                </template>
            </Card>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTestById, submitTest } from "@/api";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from 'primevue/progressspinner';
import { Card, Button, RadioButton } from "primevue";

const test = ref({});
const answers = ref([]);
const router = useRouter();
const route = useRoute();
const toast = useToast();
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const testResult = ref(null);
const isLoading = ref(true);

onMounted(async () => {
    isLoading.value = true;
    try {
        const testId = route.params.id;
        const testData = await getTestById(testId);
        test.value = testData;
        answers.value = Array(testData.questions.length).fill(null);
    } catch (error) {
        console.error("Ошибка при загрузке теста:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить тест', life: 3000 });
        router.push("/vacancies");
    } finally {
        isLoading.value = false;
    }
});

const handleSubmit = async () => {
    if (answers.value.some(answer => answer === null)) {
        toast.add({ severity: 'warn', summary: 'Предупреждение', detail: 'Пожалуйста, ответьте на все вопросы', life: 3000 });
        return;
    }

    isSubmitting.value = true;
    try {
        const result = await submitTest(route.params.id, answers.value);
        testResult.value = result;
        isSubmitted.value = true;
    } catch (error) {
        console.error("Ошибка при отправке теста:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отправить тест', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    router.back();
};
</script>

<style scoped>
.take-test {
    padding: 2rem 0;
}

.test-card {
    width: 100%;
    padding: 2rem;
}

.question-block {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--surface-ground);
}

.answers {
    margin-top: 1rem;
}

.answer-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.test-results {
    text-align: center;
}

.mt-2 {
    margin-top: 1rem;
}

.mt-3 {
    margin-top: 1.5rem;
}
</style>