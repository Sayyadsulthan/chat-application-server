import Chat from './models/chat.js';
import User from './models/user.js';

const addUser = async (data) => {
    try {
        const user = await new User(data);
        await user.save();
        return { err: null, user };
    } catch (err) {
        return { err, user: false };
    }
};

const getUsersInRoom = async (rooID) => {
    let users = await User.find({ room: rooID });
    return users || [];
};

const removeUser = async (socketID) => {
    try {
        const user = await User.findOne({ id: socketID });
        // removing the user
        await User.findOneAndDelete(user);
        return user;
    } catch (err) {
        return false;
    }
};

const getAllChatsFromRoom = async (roomID) => {
    const data = await Chat.findOne({ room: roomID });
    return data;
};

const addChatDataToRoom = async (roomID, data) => {
    const chatRoom = await Chat.findOne({ room: roomID });

    if (chatRoom) {
        chatRoom.content.push(data);
        await chatRoom.save();
    } else {
        const chat = new Chat({ room: roomID, content: [data] });
        await chat.save();
        console.log('chats creating...');
    }
};

export { addUser, removeUser, getUsersInRoom, getAllChatsFromRoom, addChatDataToRoom };
