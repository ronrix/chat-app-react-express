const { GenerateSalt } = require("../../utils");
const { UserSchema } = require("../");
const bcrypt = require('bcryptjs');
const { DEFAULT_AVATAR_PATH } = require("../../config");

class UserModel {
    async GetFilterByName(userQuery) {
        try {
            const users = await UserSchema.find({ username: { $regex: `${userQuery}`, $options: 'i' } }).limit(5);
            return users;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // find user by email
    async FindByEmail(email) {
        try {
            const user = await UserSchema.findOne({email: email});
            return user;
        } catch (error) {
           throw new Error(error);
        }
    }

    // find user by id
    async FindById(id) {
        try {
            const user = await UserSchema.findById(id);
            return user;
        } catch (error) {
           throw new Error(error);
        }
    }

    // change the online status of the user
    async SetIsOnlineFalse(_id) {
        try {
           const res = await UserSchema.updateOne(
            { "_id": _id },
            { "isOnline": false }
          );

           return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // create new user
    // using bcrypt to hash the password
    async CreateUser({email, username, password}) {
        try {
            const salt = await GenerateSalt();
            const hashedPassword = await bcrypt.hash(password, salt)
            const res = await UserSchema.create({ email, username, password: hashedPassword, isOnline: true, salt: salt, avatar: DEFAULT_AVATAR_PATH });
            return res;
        } catch (error) {
            if(error.code === 11000) {
                throw new Error("Duplicate email");
            }
            throw new Error(error);
        }
    }

    // update the avatar of the user with the new filename/path
    async UpdateAvatarById({ filename, userId }) {
        try {
            const avatar = filename ? filename : 'default-avatar.jpg';
            const res = await UserSchema.updateOne({ _id: userId }, { avatar: `uploads/${avatar}` });
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // get all users
    async GetAll(id) {
        try {
            // get all the users except the user who calls it
            const res = await UserSchema.find({ _id: { $ne: id } }, null, { limit: 10 });
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // set the "isOnline" field of the user to true to indicate that user is online
    async SetIsOnlineTrue(_id) {
        try {
            const res = await UserSchema.updateOne({ _id }, { "isOnline": true })
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // update user's username
    async UpdateUserUsernameAndEmail(username, email, _id) {
        try {
            // set the {new:true} to get the latest data after updating
            const res = await UserSchema.findOneAndUpdate({ _id }, { username, email }, { new: true });
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // update user's password
    // async UpdateUserPassword(password, _id) {
    //     try {
    //         const salt = await GenerateSalt();
    //         const hashedPassword = await bcrypt.hash(password, salt)
    //         const res = await UserSchema.updateOne({ _id }, { password: hashedPassword, salt });
    //         return res;
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }
}

module.exports = UserModel;