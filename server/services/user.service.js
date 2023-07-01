const bcrypt = require('bcryptjs');
const { UserModel } = require("../database/models");
const { GenerateSignature, FormatData } = require('../utils');
const { ValidatePassword, ValidateEmail } = require('../utils/validation');

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
                if(valid) {
                    const token = await GenerateSignature({ email: user.email, _id: user._id });

                    // set the online field to true
                    await this.#SetToOnline(user._id);

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

    async Register({ email, username, password }) {
        try {
            // validation
            const passValid = ValidatePassword(password);
            const emailValid = ValidateEmail(email);
            if(passValid && emailValid) {
                const user = await this.user.CreateUser({email, username, password});
                const token = await GenerateSignature({ email: user.email, _id: user._id });

                // set the online field to true
                await this.#SetToOnline(user._id);

                return FormatData({id: user._id, username: user.username, token }); // return id with token
            }
        } catch (error) {
            throw new Error(error) ;
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

    async GetUser(id) {
        try {
            const user = await this.user.FindById(id);
            return FormatData(user);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    async GetAllUsers(id) {
        try {
            const users = await this.user.GetAll(id);
            return FormatData(users);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    async #SetToOnline(id) {
        try {
            const user = await this.user.SetIsOnlineTrue(id);
            return FormatData(user);
        } catch (error) {
           throw new Error(error) ;
        }
    }
}

module.exports = UserService;