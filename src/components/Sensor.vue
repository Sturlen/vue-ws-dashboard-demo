<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

interface Sensor {
  id: string
  name: string
  value: number
}

interface Props {
  sensorId: string
}

const props = defineProps<Props>()

const {
  data: sensor,
  isLoading,
  error,
} = useQuery<Sensor, Error>({
  queryKey: ["sensors", props.sensorId] as const,
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:3000/sensors/${props.sensorId}`
    )
    if (!response.ok) {
      throw new Error("Failed to fetch sensor")
    }
    return response.json()
  },
})
</script>

<template>
  <tr class="sensor-row">
    <td>{{ sensor?.id }}</td>
    <td>{{ sensor?.name }}</td>
    <td class="value-cell">
      <span v-if="isLoading" class="loading">Loading...</span>
      <span v-else-if="error" class="error">Failed to load</span>
      <span v-else class="sensor-value">{{ sensor?.value }}</span>
    </td>
  </tr>
</template>

<style scoped>
.sensor-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.sensor-row:hover {
  background-color: #f9f9f9;
}

.sensor-row td {
  padding: 12px;
  color: #555;
}

.sensor-row td:last-child {
  border: none;
}

.value-cell {
  font-weight: 500;
  color: #007bff;
}

.loading {
  color: #004085;
  font-style: italic;
}

.error {
  color: #721c24;
  font-style: italic;
}

.sensor-value {
  font-size: 16px;
  font-weight: 600;
}
</style>
