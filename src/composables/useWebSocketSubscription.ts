import { onMounted, onUnmounted, ref } from "vue"
import { useQueryClient } from "@tanstack/vue-query"

interface WebSocketMessage {
  entity: string
  id: string
  payload: Record<string, unknown>
}

export const useWebSocketSubscription = (
  url: string = "wss://echo.websocket.org/"
) => {
  const queryClient = useQueryClient()
  const websocket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<string>("")
  const error = ref<string | null>(null)

  onMounted(() => {
    try {
      websocket.value = new WebSocket(url)

      websocket.value.onopen = () => {
        console.log("WebSocket connected")
        isConnected.value = true
        error.value = null
      }

      websocket.value.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data)

        const queryKey = [...data.entity, data.id].filter(Boolean)

        // Invalidate query cache based on the message
        queryClient.invalidateQueries({ queryKey })
        console.log("WebSocket message received:", data)
      }

      websocket.value.onerror = (event) => {
        console.error("WebSocket error:", event)
        error.value = "WebSocket connection error"
        isConnected.value = false
      }

      websocket.value.onclose = () => {
        console.log("WebSocket disconnected")
        isConnected.value = false
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create WebSocket"
      console.error("WebSocket creation error:", err)
    }
  })

  onUnmounted(() => {
    if (websocket.value) {
      websocket.value.close()
    }
  })

  const send = (message: string) => {
    if (websocket.value && isConnected.value) {
      websocket.value.send(message)
    } else {
      console.warn("WebSocket is not connected")
    }
  }

  return {
    websocket,
    isConnected,
    lastMessage,
    error,
    send,
  }
}
