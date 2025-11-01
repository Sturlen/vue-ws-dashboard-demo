import express from "express"
import http from "http"
import { WebSocketServer } from "ws"

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  console.log("Client connected")

  ws.on("message", (message) => {
    console.log(`Received: ${message}`)
    ws.send(`Echo: ${message}`) // Send a message back to the client
  })

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

app.get("/", (req, res) => {
  res.send("Hello from Express!")
})

server.listen(3000, () => {
  console.log("Server listening on port 3000")
})
