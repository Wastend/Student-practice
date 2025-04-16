<template>
  <header class="header">
    <div class="container">
      <div class="header-wrap">
        <RouterLink to="/" class="logo">
          <SvgIcon name="logo" />
        </RouterLink>

        <button class="hamburger" @click="toggleMobileMenu">
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
        </button>

        <div class="nav-actions" :class="{ 'mobile-active': isMobileMenuOpen }">
          <nav class="nav-links">
            <RouterLink to="/" class="nav-item" @click="closeMobileMenu"
              >Главная</RouterLink
            >
            <RouterLink
              to="/vacancies"
              class="nav-item"
              @click="closeMobileMenu"
              >Вакансии</RouterLink
            >
            <RouterLink to="/profile" class="nav-item" @click="closeMobileMenu"
              >Профиль</RouterLink
            >
          </nav>

          <button class="auth-button" @click="handleAuthClick">
            <i :class="isAuthenticated ? 'pi pi-user' : 'pi pi-sign-in'"></i>
          </button>

          <button class="theme-toggle" @click="toggleTheme">
            <i :class="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import SvgIcon from "@/components/ui/SvgIcon.vue";

const isDarkTheme = ref(false);
const isAuthenticated = ref(false);
const isMobileMenuOpen = ref(false);
const router = useRouter();

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  document.documentElement.classList.toggle("dark", isDarkTheme.value);
};

const handleAuthClick = () => {
  if (isAuthenticated.value) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style>
.header {
  background-color: var(--surface-ground);
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 1rem 0;
  margin-bottom: 60px;
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.dark .logo path {
  fill: var(--text-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: var(--primary-color);
}

.auth-button:hover i {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  00% {
    margin-right: 0px;
  }
  50% {
    margin-right: -4px;
  }
  100% {
    margin-right: 0px;
  }
}

.auth-button,
.theme-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
}

.auth-button:hover,
.theme-toggle:hover {
  background-color: var(--primary-color);
  color: #fff;
}

/* Мобильная версия */
.hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

@media (max-width: 768px) {
  .header {
    margin-bottom: 20px;
  }

  .nav-actions {
    visibility: hidden;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--menu-background-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 1rem;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .nav-actions.mobile-active {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .nav-actions:not(.mobile-active) {
    transition: opacity 0.4s ease, transform 0.4s ease,
      visibility 0.4s ease 0.4s;
  }

  .nav-links {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
    color: var(--menu-text-color);
    background-color: var(--menu-background-color);
    border-radius: 8px;
  }

  .nav-item {
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 5px;
    color: var(--menu-text-color);
    transition: background-color 0.3s ease;
  }

  .nav-item:hover {
    background-color: var(--menu-hover-color);
    color: var(--menu-hover-text-color);
  }

  .auth-button i,
  .theme-toggle i {
    color: var(--menu-text-color);
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1100;
  }

  .hamburger:hover {
    background-color: transparent;
  }

  .hamburger span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: var(--text-color);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger span.open:nth-child(2),
  .hamburger:hover span:nth-child(2) {
    width: 60%;
  }

  .hamburger span.open:nth-child(1),
  .hamburger span.open:nth-child(3),
  .hamburger:hover span:nth-child(1),
  .hamburger:hover span:nth-child(3) {
    width: 100%;
  }
}
</style>
