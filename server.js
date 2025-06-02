const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let totalCount = 0;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current count on new connection
  socket.emit('update-count', totalCount);

  // Listen for increment event from index page
  socket.on('increment', () => {
    totalCount++;
    io.emit('update-count', totalCount); // Broadcast updated count to all clients
  });

  // Listen for reset event
  socket.on('reset', () => {
    totalCount = 0;
    io.emit('update-count', totalCount);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files from 'public' folder (optional)
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
