<script setup lang="ts">
import SensorList from "./components/SensorList.vue"
import { VueQueryDevtools } from "@tanstack/vue-query-devtools"
</script>

<template>
  <VueQueryDevtools />
  <SensorList />
</template>

<style scoped></style>
