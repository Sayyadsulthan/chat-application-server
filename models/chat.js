import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    room: { type: String, require: true },
    content: [
        {
            chat: { type: String },
            user: { type: String },
            time: { type: Date, default: Date.now },
        },
    ],
});

const Chat = mongoose.model('chat', chatSchema);
export default Chat;
