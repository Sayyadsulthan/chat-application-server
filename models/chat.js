import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    room: { type: String, require: true },
    content: [
        {
            text: { type: String },
            user: { type: String },
            time: new Date(),
        },
    ],
});

const Chat = mongoose.model('chat', chatSchema);
export default Chat;
