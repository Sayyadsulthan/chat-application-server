import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, require: true },
    room: { type: String, require: true },
});

const User = mongoose.model('User', userSchema);
export default User;
