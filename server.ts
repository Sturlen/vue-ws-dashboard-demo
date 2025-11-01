import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import cors from "cors"
import { generateRandomCoordinate } from "./generateRandomCoordinate.ts"

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.use(cors())
app.use(express.json())

const center = { latitude: 58.876667, longitude: 5.637778 }

type Sensor = {
  id: string
  name: string
  value: {
    longitude: number
    latitude: number
  }
}

const sensors = new Map<string, Sensor>()

function broadcastSensorUpdate(sensorId: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(
        JSON.stringify({
          entity: ["sensors", "details", sensorId],
        })
      )
    }
  })
}

// Initialize some dummy sensors
for (let i = 1; i <= 20; i++) {
  const sensor: Sensor = {
    id: `sensor-${i}`,
    name: `Sensor ${i}`,
    value: generateRandomCoordinate(center.latitude, center.longitude, 1),
  }
  sensors.set(sensor.id, sensor)

  // update sensor values
  setInterval(() => {
    console.log("Updating value for", sensor.id)
    sensor.value = generateRandomCoordinate(
      center.latitude,
      center.longitude,
      1
    )

    broadcastSensorUpdate(sensor.id)
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

app.get("/sensors/list", (req, res) => {
  console.log("Fetching all sensors ids")
  const sensorsArray = Array.from(sensors.values()).map(({ id }) => ({ id }))
  res.json({ result: sensorsArray })
})

app.get("/sensors/details/:id", (req, res) => {
  console.log("Fetching sensor with ID:", req.params.id)
  const sensor = sensors.get(req.params.id)
  if (!sensor) {
    res.status(404).json({ error: "Sensor not found" })
  }

  res.json(sensor)
})

app.put("/sensors/details/:id", (req, res) => {
  console.log("[PUT]Updating sensor with ID:", req.params.id)

  const { name } = req.body
  if (!name) {
    console.error("Name is required")
    res.status(400).json({ error: "Name is required" })
    return
  }

  const sensor = sensors.get(req.params.id)
  if (!sensor) {
    console.error("Sensor not found")
    res.status(404).json({ error: "Sensor not found" })
    return
  }

  sensor.name = name

  broadcastSensorUpdate(sensor.id)

  return res.status(200).json(sensor)
})

server.listen(3000, () => {
  console.log("Server listening on port 3000")
})
