import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import path from 'node:path';
import cors from 'cors';

const app = express();
app.use(cors);
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

server.listen(1234, () => {
  console.log('Server running at http://localhost:1234');
});
app.use(express.static(path.join(process.cwd(), 'public')));

const users = {};

io.sockets.on('connection', client => {
  const broadcast = (event, data) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  };
  broadcast('user', users);
  client.on('message', message => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast('user', users);
    }
    broadcast('message', message);
  });
  client.on('disconnect', () => {
    delete users[client.id];
    client.broadcast.emit('user', users);
  });
});
