<template>
  <component :is="icon" :class="props.class" />
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: false,
    default: "",
  },
});

const icon = defineAsyncComponent(() =>
  import(`@/assets/svg/${props.name}.svg`).then((module) => module.default)
);
</script>
