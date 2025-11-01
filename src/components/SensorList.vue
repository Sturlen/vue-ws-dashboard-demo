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

    <table v-else-if="sensorsList.length > 0" class="sensors-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <Sensor
          v-for="sensor in sensorsList"
          :key="sensor.id"
          :sensor-id="sensor.id"
        />
      </tbody>
    </table>

    <div v-else class="no-data">No sensors available</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"
import Sensor from "./Sensor.vue"
import { useWebSocketSubscription } from "../composables/useWebSocketSubscription"

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
})

useWebSocketSubscription(`http://localhost:3000/ws`)

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

.sensors-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.sensors-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.sensors-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.sensors-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.sensors-table tbody tr:hover {
  background-color: #f9f9f9;
}

.sensors-table td {
  padding: 12px;
  color: #555;
}

.value-cell {
  font-weight: 500;
  color: #007bff;
}

.sensors-table tbody tr:last-child {
  border-bottom: none;
}
</style>
