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
import { createTest, getTestById, updateTest, createQuestion, createAnswer, getQuestionsWithAnswers, updateQuestionsAndAnswers, deleteQuestion, deleteAnswer } from "@/api";

const router = useRouter();
const route = useRoute();

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
            alert("Тест не найден или у вас нет доступа");
            router.push("/profile");
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
    const question = test.value.questions[index];
    if (question.id) {
        try {
            await deleteQuestion(question.id); // Удаляем вопрос из базы
        } catch (error) {
            console.error('Ошибка при удалении вопроса:', error);
            alert('Не удалось удалить вопрос');
            return;
        }
    }
    test.value.questions.splice(index, 1); // Удаляем вопрос из списка
};

const addAnswer = (questionIndex) => {
  test.value.questions[questionIndex].answers.push({
    text: "",
    isCorrect: false,
  });
};

const removeAnswer = async (questionIndex, answerIndex) => {
    const answer = test.value.questions[questionIndex].answers[answerIndex];
    if (answer.id) {
        try {
            await deleteAnswer(answer.id); // Удаляем ответ из базы
        } catch (error) {
            console.error('Ошибка при удалении ответа:', error);
            alert('Не удалось удалить ответ');
            return;
        }
    }
    test.value.questions[questionIndex].answers.splice(answerIndex, 1); // Удаляем ответ из списка
};

const handleSubmit = async () => {
    try {
        let testId;

        if (isEditing.value) {
            await updateTest(route.params.id, { title: test.value.title });
            testId = route.params.id;
            alert("Тест успешно обновлён!");
        } else {
            const createdTest = await createTest({ title: test.value.title });
            testId = createdTest.id;
            alert("Тест успешно создан!");
        }

        // Преобразуем ответы перед отправкой
        const questions = test.value.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
                ...answer,
                isCorrect: answer.isCorrect ? 1 : 0, // Преобразуем в 0 или 1
            })),
        }));

        // Обновляем вопросы и ответы
        await updateQuestionsAndAnswers(testId, questions);

        router.push("/profile");
    } catch (error) {
        console.error("Ошибка при сохранении теста:", error);
        alert("Не удалось сохранить тест");
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
