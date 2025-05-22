<template>
  <div id="app">
    <Toast />
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "./components/layouts/Header.vue";
import Toast from 'primevue/toast';
</script>

<style></style>
