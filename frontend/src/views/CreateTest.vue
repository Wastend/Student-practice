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
                      true-value="true"
                      false-value="false"
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

const addQuestion = () => {
  test.value.questions.push({
    text: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
};

const removeQuestion = (index) => {
  test.value.questions.splice(index, 1);
};

const addAnswer = (questionIndex) => {
  test.value.questions[questionIndex].answers.push({
    text: "",
    isCorrect: false,
  });
};

const removeAnswer = (questionIndex, answerIndex) => {
  test.value.questions[questionIndex].answers.splice(answerIndex, 1);
};

const handleSubmit = () => {
  console.log("Тест сохранен:", test.value);
  alert("Тест успешно сохранен!");
  router.push("/profile");
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
