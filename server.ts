import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import cors from "cors"

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.use(cors())
app.use(express.json())

type Sensor = {
  id: string
  name: string
  value: number
}

const sensors = new Map<string, Sensor>()

// Initialize some dummy sensors
for (let i = 1; i <= 5; i++) {
  const sensor: Sensor = {
    id: `sensor-${i}`,
    name: `Sensor ${i}`,
    value: Math.random() * 100,
  }
  sensors.set(sensor.id, sensor)

  // update sensor values
  setInterval(() => {
    console.log("Updating value for", sensor.id)
    sensor.value = Math.random() * 100

    // Broadcast update to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(
          JSON.stringify({
            entity: ["sensors", sensor.id],
          })
        )
      }
    })
  }, 1000 + i * 500)
}

wss.on("connection", (ws) => {
  console.log("Client connected")

  ws.on("message", (message) => {
    console.log(`Received: ${message}`)
    ws.send(`Echo: ${message}`) // Send a message back to the client
  })

  ws.send(
    JSON.stringify({ entity: ["sensors"] }) // invalidate all sensors on connect
  )

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

app.use(express.static("dist"))

app.get("/", (req, res) => {
  res.sendFile("dist/index.html")
})

app.get("/sensors", (req, res) => {
  console.log("Fetching all sensors")
  const sensorsArray = Array.from(sensors.values())
  res.json({ result: sensorsArray })
})

app.get("/sensors/:id", (req, res) => {
  console.log("Fetching sensor with ID:", req.params.id)
  const sensor = sensors.get(req.params.id)
  if (!sensor) {
    res.status(404).json({ error: "Sensor not found" })
  }

  res.json(sensor)
})

server.listen(3000, () => {
  console.log("Server listening on port 3000")
})
