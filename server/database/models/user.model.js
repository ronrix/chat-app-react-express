const { GenerateSalt } = require("../../utils");
const { UserSchema } = require("../");
const bcrypt = require('bcryptjs');

class UserModel {
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
           console.log(res);

           return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // create new user
    async CreateUser({email, username, password}) {
        try {
            const salt = await GenerateSalt();
            const hashedPassword = await bcrypt.hash(password, salt)
            const res = await UserSchema.create({ email, username, password: hashedPassword, isOnline: true, salt: salt });
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = UserModel;