const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;

let totalClicks = 0;

// Serve static files (index.html, display.html, etc.)
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current click count immediately
  socket.emit('updateCount', totalClicks);

  // On click event from any client
  socket.on('click', () => {
    totalClicks++;
    io.emit('updateCount', totalClicks); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});