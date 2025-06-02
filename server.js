// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let globalCount = 0;

app.use(express.static('public')); // assumes your HTML files are in 'public' folder

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send current count to new client
  socket.emit('update-count', globalCount);

  socket.on('click', () => {
    globalCount++;
    // Broadcast updated count to ALL connected clients (index + display)
    io.emit('update-count', globalCount);
  });

  socket.on('reset', () => {
    globalCount = 0;
    io.emit('update-count', globalCount);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
