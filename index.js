import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

import { addUser, removeUser, getUsersInRoom } from './users.js';

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
    // console.log('request');
    res.status(200).send('<h1>Hello World!! </h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // when the user joins the room

    socket.on('joinRoom', async (data, callback) => {
        // console.log(data);
        const { err, user } = await addUser({ id: socket.id, name: data.user, room: data.room });
        // console.log(await getUsersInRoom(user.room));
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
        const allUsers = await getUsersInRoom(user.room);
        socket.to(user.room).emit('userList', allUsers);
    });

    // on disconnnect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: user.name, chat: `${user.name} has left.` });
            io.to(user.room).emit('userList', getUsersInRoom(user.room));
        }
    });
});

server.listen(PORT, () => {
    mongoose
        .connect('mongodb://127.0.0.1:27017/chatApp')
        .then(() => console.log('db connected'))
        .catch((err) => console.error.bind(console, err));
    console.log(`server running at http://localhost:${PORT}`);
});
