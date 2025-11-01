<template>
  <div class="websocket-container">
    <h2>WebSocket Connection</h2>

    <div class="status" :class="connectionStatus">
      Status: {{ connectionStatus }}
    </div>

    <div class="message-section">
      <input
        v-model="messageInput"
        type="text"
        placeholder="Enter a message"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="connectionStatus !== 'connected'">
        Send
      </button>
    </div>

    <div class="latest-message">
      <h3>Latest Message Received:</h3>
      <p v-if="latestMessage" class="message-display">{{ latestMessage }}</p>
      <p v-else class="no-message">Waiting for messages...</p>
    </div>

    <div class="message-history">
      <h3>Message History:</h3>
      <ul>
        <li v-for="(msg, index) in messageHistory" :key="index">
          {{ msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const connectionStatus = ref<"connected" | "disconnected" | "connecting">(
  "disconnected"
)
const latestMessage = ref<string>("")
const messageInput = ref<string>("")
const messageHistory = ref<string[]>([])
let ws: WebSocket | null = null

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})

const connectWebSocket = () => {
  connectionStatus.value = "connecting"

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  const wsUrl = `${protocol}//${window.location.hostname}:${3000}/ws` // Hardcoded port 3000 for WebSocket server test

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    connectionStatus.value = "connected"
    console.log("WebSocket connected")
  }

  ws.onmessage = (event) => {
    const message = event.data
    latestMessage.value = message
    messageHistory.value.unshift(message)
    // Keep only the last 20 messages
    if (messageHistory.value.length > 20) {
      messageHistory.value.pop()
    }
  }

  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
    connectionStatus.value = "disconnected"
  }

  ws.onclose = () => {
    connectionStatus.value = "disconnected"
    console.log("WebSocket disconnected")
    // Attempt to reconnect after 3 seconds
    setTimeout(() => {
      connectWebSocket()
    }, 3000)
  }
}

const sendMessage = () => {
  if (messageInput.value.trim() && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(messageInput.value)
    messageInput.value = ""
  }
}
</script>

<style scoped>
.websocket-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 500px;
  margin: 20px auto;
}

h2 {
  color: #333;
  margin-top: 0;
}

.status {
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.status.connected {
  background-color: #d4edda;
  color: #155724;
}

.status.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.status.connecting {
  background-color: #fff3cd;
  color: #856404;
}

.message-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
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

.latest-message {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
}

.latest-message h3 {
  margin-top: 0;
  color: #333;
}

.message-display {
  background-color: #e7f3ff;
  padding: 10px;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  color: #004085;
  word-break: break-word;
}

.no-message {
  color: #999;
  font-style: italic;
}

.message-history {
  padding: 15px;
  background-color: white;
  border-radius: 4px;
}

.message-history h3 {
  margin-top: 0;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 8px;
  border-bottom: 1px solid #eee;
  color: #555;
  word-break: break-word;
}

li:last-child {
  border-bottom: none;
}
</style>
