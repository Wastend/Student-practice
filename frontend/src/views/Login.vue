<template>
  <section class="login">
    <div class="container">
      <Card class="login-card">
        <template #title>
          <h2 class="login-title">Вход</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email</label>
              <InputText id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="password">Пароль</label>
              <Password id="password" v-model="password" toggleMask required />
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
import { useToast } from "primevue/usetoast";
import { login } from "@/api";

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();

const handleLogin = async () => {
    try {
        const { token } = await login(email.value, password.value);
        localStorage.setItem("token", token);
        router.push("/profile");
    } catch (error) {
        console.error("Ошибка при входе:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Неверные данные для входа', life: 3000 });
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
  padding: 0.75rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  background: var(--surface-ground);
  color: var(--text-color);
  transition: border-color 0.2s;
}

.p-inputtext:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-alpha-20);
}

.p-password {
  width: 100%;
}

.p-password-input {
  width: 100%;
}

.p-button {
  width: 100%;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.p-button-primary {
  background: var(--primary-color);
  border: none;
  color: var(--primary-color-text);
}

.p-button-primary:hover {
  background: var(--primary-600);
}

.p-card {
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.p-card .p-card-content {
  padding: 1.5rem;
}

label {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}
</style>
