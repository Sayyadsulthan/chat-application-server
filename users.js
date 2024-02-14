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
    const users = await User.find();
    // console.log('all room users:, ', users);
    return users;
};

const removeUser = async (socketID) => {
    try {
        const user = await User.findOne({ id: socketID });
        await User.findOneAndDelete(user);
        if (user) {
            return user;
        }

        return false;
    } catch (err) {
        return false;
    }
};

export { addUser, removeUser, getUsersInRoom };
