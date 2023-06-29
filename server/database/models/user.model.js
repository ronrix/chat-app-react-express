const { UserSchema } = require("../schemas");

class UserModel {
    async FindByEmail(email) {
        try {
            const user = await UserSchema.findOne({email: email});
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
}

module.exports = UserModel;