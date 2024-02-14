import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
    allowEIO3: true,
});
const PORT = process.env.PORT || 8000;

// app.use(cors({ allowedHeaders: true, origin: ['http://localhost:3000', 'http://localhost:3001'] }));

app.get('/', (req, res) => {
    console.log('request');
    res.status(200).send('<h1>Hello World!! </h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', async ({ user, room }, callback) => {
        const { err, user } = addUser({ id: socket.id, name: user, room });

        if (err) {
            return callback(err);
        }

        socket.join(user.room);
        // emitting to the joined uer
        socket.emit('message', { user: 'admin', chat: `Welcome to the room : ${user.room}` });
        // emmiting to the room
        socket.broadcast
            .to(user.room)
            .emit('message', { user: user.name, chat: `${user.name} has joined to room!` });
        const allUsers = await getUsersInRoom();
        socket.to(user.room).emit('userList', allUsers);
    });
});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
