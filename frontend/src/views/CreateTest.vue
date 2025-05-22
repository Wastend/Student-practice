<!-- filepath: /Users/evgeniy/sites/Student-practice/frontend/src/views/CreateTest.vue -->
<template>
  <section class="create-test">
    <div class="container">
      <Card class="create-test-card">
        <template #title>
          <h2 class="create-test-title">Создание теста</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit">
            <!-- Название теста -->
            <div class="form-group">
              <label for="testTitle">Название теста</label>
              <InputText id="testTitle" v-model="test.title" required />
            </div>

            <!-- Тема теста -->
            <!-- <div class="form-group">
              <label for="testTopic">Тема теста</label>
              <InputText id="testTopic" v-model="testTopic" placeholder="Введите тему теста" />
              <Button
                label="Сгенерировать тест"
                class="btn-secondary mt-2"
                @click="generateTest"
                :disabled="isGenerating"
              />
            </div> -->

            <!-- Вопросы -->
            <div class="form-group">
              <h3>Вопросы</h3>
              <div
                v-for="(question, index) in test.questions"
                :key="index"
                class="question-block"
              >
                <label :for="'question-' + index">Вопрос {{ index + 1 }}</label>
                <InputText
                  :id="'question-' + index"
                  v-model="question.text"
                  placeholder="Введите текст вопроса"
                  required
                />
                <div class="answers">
                  <h4>Варианты ответов</h4>
                  <div
                    v-for="(answer, answerIndex) in question.answers"
                    :key="answerIndex"
                    class="answer-block"
                  >
                    <InputText
                      v-model="answer.text"
                      placeholder="Введите текст ответа"
                      required
                    />
                    <Checkbox
                      v-model="answer.isCorrect"
                      binary
                      :label="'Правильный ответ'"
                    />
                    <Button
                      icon="pi pi-times"
                      class="p-button-text p-button-danger"
                      @click="removeAnswer(index, answerIndex)"
                    />
                  </div>
                  <Button
                    label="Добавить вариант ответа"
                    class="p-button-text p-button-success"
                    @click="addAnswer(index)"
                  />
                </div>
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger mt-2 trash-button"
                  @click="removeQuestion(index)"
                >
                  Удалить вопрос
                </Button>
              </div>
              <Button
                label="Добавить вопрос"
                class="p-button-text p-button-primary mt-2"
                @click="addQuestion"
              />
            </div>

            <!-- Кнопка отправки -->
            <Button
              label="Сохранить тест"
              class="btn-primary mt-3"
              type="submit"
            />
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import { Button, Card, Checkbox, InputText } from "primevue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { createTest, getTestById, updateTest, createQuestion, createAnswer, getQuestionsWithAnswers, updateQuestionsAndAnswers, deleteQuestion, deleteAnswer, generateTestAPI } from "@/api";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const test = ref({
  title: "",
  questions: [
    {
      text: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ],
});

const testTopic = ref("");
const isGenerating = ref(false);

const isEditing = ref(false);

onMounted(async () => {
    const testId = route.params.id;
    if (testId) {
        isEditing.value = true;
        try {
            test.value = await getTestById(testId);
            const questionsWithAnswers = await getQuestionsWithAnswers(testId);

            // Преобразуем is_correct в булевое значение
            test.value.questions = questionsWithAnswers.map((question) => ({
                ...question,
                answers: question.answers.map((answer) => ({
                    ...answer,
                    isCorrect: !!answer.is_correct, // Преобразуем в true/false
                })),
            }));
        } catch (error) {
            console.error("Ошибка при загрузке теста:", error);
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Тест не найден или у вас нет доступа', life: 3000 });
            router.push("/tests");
        }
    }
});

const addQuestion = () => {
  test.value.questions.push({
    text: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
};

const removeQuestion = async (index) => {
    if (isEditing.value && test.value.questions[index].id) {
        try {
            await deleteQuestion(test.value.questions[index].id);
            test.value.questions.splice(index, 1);
        } catch (error) {
            console.error("Ошибка при удалении вопроса:", error);
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить вопрос', life: 3000 });
        }
    } else {
        test.value.questions.splice(index, 1);
    }
};

const addAnswer = (questionIndex) => {
  test.value.questions[questionIndex].answers.push({
    text: "",
    isCorrect: false,
  });
};

const removeAnswer = async (questionIndex, answerIndex) => {
    if (isEditing.value && test.value.questions[questionIndex].answers[answerIndex].id) {
        try {
            await deleteAnswer(test.value.questions[questionIndex].answers[answerIndex].id);
            test.value.questions[questionIndex].answers.splice(answerIndex, 1);
        } catch (error) {
            console.error("Ошибка при удалении ответа:", error);
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить ответ', life: 3000 });
        }
    } else {
        test.value.questions[questionIndex].answers.splice(answerIndex, 1);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEditing.value) {
            await updateTest(test.value);
            toast.add({ severity: 'success', summary: 'Успех', detail: 'Тест успешно обновлён!', life: 3000 });
        } else {
            await createTest(test.value);
            toast.add({ severity: 'success', summary: 'Успех', detail: 'Тест успешно создан!', life: 3000 });
        }
        router.push("/tests");
    } catch (error) {
        console.error("Ошибка при сохранении теста:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить тест', life: 3000 });
    }
};

const handleAddQuestion = async (testId, question) => {
    const newQuestion = await createQuestion(testId, question);
    console.log("Вопрос добавлен:", newQuestion);
};

const handleAddAnswer = async (questionId, answer) => {
    const newAnswer = await createAnswer(questionId, answer);
    console.log("Ответ добавлен:", newAnswer);
};

const generateTest = async () => {
    if (!testTopic.value) {
        toast.add({ severity: 'warn', summary: 'Предупреждение', detail: 'Введите тему теста!', life: 3000 });
        return;
    }

    isGenerating.value = true;
    try {
        const generatedTest = await generateTestAPI(testTopic.value);
        test.value = generatedTest;
        toast.add({ severity: 'success', summary: 'Успех', detail: 'Тест успешно сгенерирован!', life: 3000 });
    } catch (error) {
        console.error("Ошибка при генерации теста:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сгенерировать тест', life: 3000 });
    } finally {
        isGenerating.value = false;
    }
};
</script>

<style scoped>
.create-test {
  padding: 2rem 0;
}

.create-test-card {
  width: 100%;
  padding: 2rem;
}

.create-test-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
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

.answer-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 1.5rem;
}

.trash-button {
  width: 100%;
  max-width: 150px;
}
</style>
