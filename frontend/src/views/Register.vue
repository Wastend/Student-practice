<template>
  <section class="register">
    <div class="container">
      <Card class="register-card">
        <template #title>
          <h2 class="register-title">Регистрация</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="role">Выберите роль</label>
              <Select
                id="role"
                v-model="role"
                :options="roles"
                option-label="label"
                placeholder="Выберите роль"
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <InputText id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="password">Пароль</label>
              <Password id="password" v-model="password" toggleMask required />
            </div>
            <div v-if="role.value === 'company'" class="company-fields">
              <div class="form-group">
                <label for="companyName">Название компании</label>
                <InputText id="companyName" v-model="companyName" required />
              </div>
              <div class="form-group">
                <label for="companyWebsite">Веб-сайт компании</label>
                <InputText id="companyWebsite" v-model="companyWebsite" />
              </div>
              <div class="form-group">
                <label for="companyDescription">Описание компании</label>
                <Textarea
                  id="companyDescription"
                  v-model="companyDescription"
                  rows="4"
                  autoResize
                />
              </div>
            </div>
            <Button
              label="Зарегистрироваться"
              class="btn-primary"
              type="submit"
            />
            <p class="register-link">
              Есть аккаунт?
              <RouterLink to="/login">Авторизоваться</RouterLink>
            </p>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import { Button, Card, InputText, Password, Select, Textarea } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const roles = [
  { label: "Студент", value: "student" },
  { label: "Компания", value: "company" },
];

const role = ref(null);
const email = ref("");
const password = ref("");
const companyName = ref("");
const companyWebsite = ref("");
const companyDescription = ref("");
const router = useRouter();

const handleRegister = () => {
  if (role.value === "company" && !companyName.value) {
    alert("Пожалуйста, укажите название компании");
    return;
  }
  // Пример регистрации
  localStorage.setItem("token", "example-token");
  router.push("/profile");
};
</script>

<style>
.register {
  padding: 2rem 0;
}

.register-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style>
