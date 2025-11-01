<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { ref, watch } from "vue"

interface Sensor {
  id: string
  name: string
  value: { latitude: number; longitude: number }
}

interface Props {
  sensorId: string
}

const props = defineProps<Props>()
const queryClient = useQueryClient()

const {
  data: sensor,
  isLoading,
  error,
} = useQuery<Sensor, Error>({
  queryKey: ["sensors", "details", props.sensorId] as const,
  queryFn: async () => {
    const response = await fetch(`/sensors/details/${props.sensorId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch sensor")
    }
    return response.json()
  },
})

const sensorName = ref<string>("")

// Watch for sensor changes and update if needed (but not on blur)
watch(
  () => sensor.value?.name,
  (newName) => {
    if (newName && sensorName.value !== newName) {
      sensorName.value = newName
    }
  },
  { immediate: true }
)

const { mutate: updateSensorName, isPending: isUpdating } = useMutation<
  Sensor,
  Error,
  string
>({
  mutationFn: async (newName: string) => {
    const response = await fetch(`/sensors/details/${props.sensorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
    if (!response.ok) {
      throw new Error("Failed to update sensor")
    }
    return response.json()
  },
  onSuccess: (updatedSensor) => {
    queryClient.setQueryData(
      ["sensors", "details", props.sensorId],
      updatedSensor
    )
  },
})

const handleNameChange = () => {
  if (sensorName.value && sensorName.value !== sensor.value?.name) {
    updateSensorName(sensorName.value)
  }
}
</script>

<template>
  <tr class="sensor-row">
    <td>{{ sensor?.id }}</td>
    <td>
      <input
        v-model="sensorName"
        @blur="handleNameChange"
        @keyup.enter="handleNameChange"
        :disabled="isUpdating"
        placeholder="Enter sensor name"
      />
    </td>
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
  padding: 8px;
}

.sensor-row input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.sensor-row input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.sensor-row input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
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
