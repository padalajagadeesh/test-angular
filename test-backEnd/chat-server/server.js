const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let users = [];
let messages = [];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  user ? res.status(200).send(user) : res.status(401).send({ error: 'Invalid credentials' });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.status(201).send({ message: 'User registered' });
});


io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', (message) => {
    messages.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
server.listen(3000,"192.168.10.24", () => {
  console.log('Server listening on http://localhost:3000');
});
