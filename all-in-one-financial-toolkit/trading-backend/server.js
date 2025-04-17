const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'Trading backend running' });
});

// WebSocket server for real-time trading updates
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo message back for demo
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`Trading backend listening at http://localhost:${port}`);
});
