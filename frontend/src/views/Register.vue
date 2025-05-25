<template>
  <section class="register">
    <div class="container">
      <Card class="register-card">
        <template #title>
          <h2 class="register-title">Регистрация</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="username">Имя пользователя</label>
              <InputText
                id="username"
                v-model="form.username"
                :class="{ 'p-invalid': errors.username }"
                required
              />
              <small class="p-error" v-if="errors.username">{{ errors.username }}</small>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                :class="{ 'p-invalid': errors.email }"
                required
              />
              <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
            </div>
            <div class="form-group">
              <label for="password">Пароль</label>
              <Password
                id="password"
                v-model="form.password"
                :feedback="true"
                :class="{ 'p-invalid': errors.password }"
                required
              />
              <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
            </div>
            <div class="form-group">
              <label for="role">Роль</label>
              <Dropdown
                id="role"
                v-model="form.role_id"
                :options="roles"
                optionLabel="name"
                optionValue="id"
                placeholder="Выберите роль"
                :class="{ 'p-invalid': errors.role_id }"
                required
              />
              <small class="p-error" v-if="errors.role_id">{{ errors.role_id }}</small>
            </div>
            <div v-if="form.role_id === 2" class="company-fields">
              <div class="form-group">
                <label for="companyName">Название компании</label>
                <InputText
                  id="companyName"
                  v-model="form.company_name"
                  :class="{ 'p-invalid': errors.company_name }"
                  required
                />
                <small class="p-error" v-if="errors.company_name">{{ errors.company_name }}</small>
              </div>
              <div class="form-group">
                <label for="companyWebsite">Веб-сайт компании</label>
                <InputText
                  id="companyWebsite"
                  v-model="form.company_website"
                  :class="{ 'p-invalid': errors.company_website }"
                  required
                />
                <small class="p-error" v-if="errors.company_website">{{ errors.company_website }}</small>
              </div>
              <div class="form-group">
                <label for="companyDescription">Описание компании</label>
                <Textarea
                  id="companyDescription"
                  v-model="form.company_description"
                  rows="3"
                  :class="{ 'p-invalid': errors.company_description }"
                  required
                />
                <small class="p-error" v-if="errors.company_description">{{ errors.company_description }}</small>
              </div>
            </div>
            <Button
              label="Зарегистрироваться"
              class="btn-primary"
              type="submit"
              :loading="isSubmitting"
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
import { Button, Card, InputText, Password, Dropdown, Textarea } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { register } from "../api";

const roles = [
  { id: 1, name: "Студент" },
  { id: 2, name: "Компания" },
];

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const errors = ref({});

const form = ref({
  username: '',
  email: '',
  password: '',
  role_id: null,
  company_name: '',
  company_website: '',
  company_description: ''
});

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.username) {
    errors.value.username = 'Введите имя пользователя';
    isValid = false;
  }

  if (!form.value.email) {
    errors.value.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Введите корректный email';
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = 'Введите пароль';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Пароль должен содержать минимум 6 символов';
    isValid = false;
  }

  if (!form.value.role_id) {
    errors.value.role_id = 'Выберите роль';
    isValid = false;
  }

  if (form.value.role_id === 2) {
    if (!form.value.company_name) {
      errors.value.company_name = 'Введите название компании';
      isValid = false;
    }

    if (!form.value.company_website) {
      errors.value.company_website = 'Введите веб-сайт компании';
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(form.value.company_website)) {
      errors.value.company_website = 'Введите корректный URL';
      isValid = false;
    }

    if (!form.value.company_description) {
      errors.value.company_description = 'Введите описание компании';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  try {
    await register(form.value);
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Регистрация успешно завершена',
      life: 3000
    });
    router.push('/login');
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      if (message.includes('username')) {
        errors.value.username = 'Пользователь с таким именем уже существует';
      } else if (message.includes('email')) {
        errors.value.email = 'Пользователь с таким email уже существует';
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: message,
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Произошла ошибка при регистрации',
        life: 3000
      });
    }
  } finally {
    isSubmitting.value = false;
  }
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

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.p-invalid {
  border-color: var(--red-500) !important;
}
</style>
