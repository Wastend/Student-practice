<template>
  <section class="login">
    <div class="container">
      <Card class="login-card">
        <template #title>
          <h2 class="login-title">Вход</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="email">Email</label>
              <InputText id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="password">Пароль</label>
              <Password id="password" v-model="form.password" toggleMask :feedback="false" required />
            </div>
            <Button label="Войти" class="btn-primary" type="submit" />
          </form>
          <p class="register-link">
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </p>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup>
import { Button, Card, InputText, Password } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api";
import { saveToken } from "../utils/auth";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const form = ref({
  email,
  password,
});

const handleSubmit = async () => {
  try {
    const response = await login(form.value.email, form.value.password);
    console.log('Login Response:', response);
    
    // Сохраняем токен и данные пользователя
    saveToken(response.token);
    
    // Обновляем store
    authStore.setToken(response.token);
    authStore.setUser(response.user);
    
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Вы успешно вошли в систему',
      life: 3000
    });
    
    router.push("/profile");
  } catch (error) {
    console.error("Ошибка при входе:", error);
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: error.response?.data?.message || "Не удалось войти в систему",
      life: 3000,
    });
  }
};
</script>

<style>
.login {
  padding: 2rem 0;
}

.login-card,
.register-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.login-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.p-inputtext {
  width: 100%;
}

.login-card button,
.register-card button {
  width: 100%;
}
</style>
