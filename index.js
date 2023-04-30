// const http = require('http');
const express = require('express');
// const socketIO = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
// const server = http.createServer(app);
// const io = socketIO(server);

app.use(express.static(`${__dirname}/public/`));

// const users = {};

// io.on('connection', socket => {
//   socket.on('new-user', name => {
//     users[socket.id] = name;
//     socket.broadcast.emit('user-connected', name);
//   });
//   socket.on('send-chat-message', message => {
//     socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
//   });
//   socket.on('disconnect', () => {
//     socket.broadcast.emit('user-disconnected', users[socket.id]);
//     delete users[socket.id];
//   });
// });

app.listen(PORT, () => {
    console.log('Started: ' + new Date());
    console.log(`url: http://localhost:${PORT}`);
});
