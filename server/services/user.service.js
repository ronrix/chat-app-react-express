const bcrypt = require('bcryptjs');
const { UserModel } = require("../database/models");
const { GenerateSignature, FormatData } = require('../utils');

class UserService {
    constructor() {
        this.user = new UserModel();
    }

    async Signin({ email, password }) {
        try {
            const user = await this.user.FindByEmail(email); // find the user by email

            if(user) {
                // check password        
                const hashedPassword = user.password;
                const valid = await bcrypt.compare(password, hashedPassword);
                console.log(valid);
                if(valid) {
                    const token = await GenerateSignature({ email: user.email, _id: user._id });
                    return FormatData({id: user._id, token }); // return id with token
                }

                // incorrect password
                return FormatData({ id: user._id, token: null });
            }

            return FormatData(null);
        } catch (error) {
            throw new Error(error);
        }
    }

    async Signout(_id) {
        try {
           // update the 'isOnline' field
           const res = await this.user.SetIsOnlineFalse(_id);
           console.log(res);
           return FormatData({ msg: 'Successfully logout!'});
        } catch (error) {
           throw new Error(error);
        }
    }
}

module.exports = UserService;