import { WebSocketServer } from "ws";
import { createServer } from "http";

const server = createServer();
const wss = new WebSocketServer({ server });
const clients = new Set();
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client connected");

  // Heartbeat mechanism
  const heartbeat = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping(); // Send a ping to the client
    }
  }, HEARTBEAT_INTERVAL);

  ws.on("message", (message) => {
    try {
      const event = JSON.parse(message);
      // Broadcast the event to all connected clients except the sender
      clients.forEach((client) => {
        if (client !== ws && client.readyState === client.OPEN) {
          client.send(JSON.stringify(event));
        }
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    clearInterval(heartbeat); // Clear the heartbeat interval
    clients.delete(ws);
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is running on port 8080");
});
