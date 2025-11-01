<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

interface Sensor {
  id: string
  name: string
  value: { latitude: number; longitude: number }
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
    const response = await fetch(`/sensors/${props.sensorId}`)
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
      <span v-else class="sensor-value">
        {{ sensor?.value?.latitude?.toFixed(6) }},
        {{ sensor?.value?.longitude?.toFixed(6) }}
      </span>
    </td>
  </tr>
</template>

<style scoped>
.sensor-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.sensor-row:hover {
  background-color: #f0f7ff;
}

.sensor-row td {
  padding: 12px;
  color: #555;
  text-align: left;
  width: 33.333%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  vertical-align: middle;
}

.sensor-row td:first-child {
  color: #666;
  font-family: monospace;
  font-size: 13px;
}

.sensor-row td:nth-child(2) {
  font-weight: 500;
  color: #333;
}

.value-cell {
  font-weight: 600;
  color: #007bff;
  font-size: 15px;
  text-align: center;
}

.loading {
  color: #0056b3;
  font-style: italic;
  font-size: 12px;
}

.error {
  color: #721c24;
  font-style: italic;
  font-size: 12px;
}

.sensor-value {
  font-size: 16px;
  font-weight: 700;
  color: #0056b3;
  letter-spacing: 0.5px;
}
</style>
