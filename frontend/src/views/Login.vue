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
import { login } from "@/api";

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
    try {
        const { token } = await login(email.value, password.value);
        localStorage.setItem("token", token);
        router.push("/profile");
    } catch (error) {
        console.error("Ошибка при входе:", error);
        alert("Неверные данные для входа");
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
