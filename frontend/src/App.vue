<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "./components/layouts/Header.vue";
</script>

<style></style>
