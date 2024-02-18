import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

import {
    addUser,
    removeUser,
    getUsersInRoom,
    getAllChatsFromRoom,
    addChatDataToRoom,
} from './users.js';

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

app.use(cors({ allowedHeaders: true, origin: '*' }));

app.get('/', (req, res) => {
    // console.log('request');
    res.status(200).send('<h1>Hello World!! </h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // when the user joins the room
    console.log(socket.id);
    socket.on('joinRoom', async (data) => {
        const { err, user } = await addUser({ id: socket.id, name: data.user, room: data.room });
        if (err) {
            console.log(err);
            return;
        }
        try {
            const allUsers = await getUsersInRoom(user.room);

            socket.join(user.room);
            const oldChats = await getAllChatsFromRoom(user.room);
            socket.emit('oldMessages', oldChats ? oldChats.content : []);
            // emitting to the joined uer
            socket.emit('message', { user: user.name, chat: `Welcome to the room : ${user.room}` });
            // emmiting to the room
            socket.broadcast
                .to(user.room)
                .emit('message', { user: user.name, chat: `${user.name} has joined to room!` });
            // emit the userList to joined user and all users in room
            socket.emit('userList', allUsers);
            socket.to(user.room).emit('userList', allUsers);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('sendMessage', async (data) => {
        // add the data to database
        try {
            // send the text to all users in room
            socket.to(data.room).emit('receiveMessage', { user: data.user, chat: data.chat });

            await addChatDataToRoom(data.room, { user: data.user, chat: data.chat });
        } catch (err) {
            console.log(err);
        }
    });

    // on disconnnect
    socket.on('disconnect', async () => {
        if (socket.id) {
            const user = await removeUser(socket.id);
            if (user) {
                const allUsers = await getUsersInRoom(user.room);
                io.to(user.room).emit('message', {
                    user: user.name,
                    chat: `${user.name} has left.`,
                });
                io.to(user.room).emit('userList', allUsers);
            }
        }
    });
});

server.listen(PORT, () => {
    mongoose
        .connect(process.env.DB_URL)
        .then(() => console.log('db connected'))
        .catch((err) => console.error.bind(console, err));
    console.log(`server running at http://localhost:${PORT}`);
});
