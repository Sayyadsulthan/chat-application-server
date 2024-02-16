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
    return users;
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

export { addUser, removeUser, getUsersInRoom };
