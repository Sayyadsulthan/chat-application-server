import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    room: { type: String, require: true },
    id: { type: String },
});

export default User = mongoose.model('User');
