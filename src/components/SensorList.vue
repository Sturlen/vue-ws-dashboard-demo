<template>
  <div class="sensor-list-container">
    <h2>Sensors</h2>

    <div class="controls">
      <button @click="() => refetch()" :disabled="isLoading">
        {{ isLoading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading sensors...</div>

    <div v-else-if="error" class="error">
      <p>Failed to load sensors: {{ error }}</p>
    </div>

    <div v-else-if="sensorsList.length > 0" class="sensors-grid">
      <div v-for="sensor in sensorsList" :key="sensor.id" class="sensor-card">
        <div class="sensor-name">{{ sensor.name }}</div>
        <div class="sensor-value">{{ sensor.value }}</div>
        <div class="sensor-id">ID: {{ sensor.id }}</div>
      </div>
    </div>

    <div v-else class="no-data">No sensors available</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"

interface Sensor {
  id: string
  name: string
  value: number
}

const { data, isLoading, error, refetch } = useQuery<
  { result: Sensor[] },
  Error
>({
  queryKey: ["sensors"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:3000/sensors`)
    if (!response.ok) {
      throw new Error("Failed to fetch sensors")
    }
    return response.json()
  },
  refetchInterval: 5000, // Refetch every 5 seconds
})

const sensorsList = computed(() => data.value?.result || [])
</script>

<style scoped>
.sensor-list-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 900px;
  margin: 20px auto;
}

h2 {
  color: #333;
  margin-top: 0;
}

.controls {
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading,
.error,
.no-data {
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}

.loading {
  background-color: #e7f3ff;
  color: #004085;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.no-data {
  background-color: #fff3cd;
  color: #856404;
}

.sensors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.sensor-card {
  background-color: white;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.sensor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.sensor-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.sensor-value {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 8px;
}

.sensor-id {
  font-size: 12px;
  color: #666;
}
</style>
