import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const server = createServer();
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('message', (message) => {
    const event = JSON.parse(message);
    // Broadcast the event to all connected clients except the sender
    clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(event));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
});