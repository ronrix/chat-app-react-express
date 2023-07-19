const bcrypt = require('bcryptjs');
const { UserModel } = require("../database/models");
const { GenerateSignature, FormatData } = require('../utils');
const { ValidatePassword, ValidateEmail, VerifyEmail } = require('../utils/validation');

class UserService {
    constructor() {
        this.user = new UserModel();
    }

    // sign in the user
    async Signin({ email, password }) {
        try {
            const user = await this.user.FindByEmail(email); // find the user by email

            if(user) { // if user exists
                // check password        
                const hashedPassword = user.password;
                const valid = await bcrypt.compare(password, hashedPassword);
                if(valid) {
                    const token = await GenerateSignature({ email: user.email, _id: user._id });

                    // set the online field to true
                    await this.#SetToOnline(user._id);

                    return FormatData({id: user._id, username: user.username, avatar: user.avatar, token }); // return id with token
                }

                // incorrect password
                return FormatData({ id: user._id, token: null });
            }

            return FormatData(null);
        } catch (error) {
            throw new Error(error);
        }
    }

    // register new user
    async Register({ email, username, password }) {
        try {
            // validate email and password
            const passValid = ValidatePassword(password);
            const emailValid = ValidateEmail(email);
            if(passValid && emailValid) { // if validation succeed, create new user
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

    // register new user
    async UpdateAvatar({ filename, userId }) {
        try {
            const res = await this.user.UpdateAvatarById({ filename, userId });
            if(res.modifiedCount) {
                return FormatData({ msg: "Success", status: 204 }); // return with message
            }
            return FormatData({ msg: "Avatar was not stored in the Db", status: 400 }); // return with message
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // sign out the user
    async Signout(_id) {
        try {
           // update the 'isOnline' field
           const res = await this.user.SetIsOnlineFalse(_id);
           return FormatData({ msg: 'Successfully logout!'});
        } catch (error) {
           throw new Error(error);
        }
    }

    // get the user by id
    async GetUser(id) {
        try {
            const user = await this.user.FindById(id);
            return FormatData(user);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // get all users
    async GetAllUsers(id) {
        try {
            const users = await this.user.GetAll(id);
            return FormatData(users);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // update the user to "isOnline" to true
    async #SetToOnline(id) {
        try {
            const user = await this.user.SetIsOnlineTrue(id);
            return FormatData(user);
        } catch (error) {
           throw new Error(error) ;
        }
    }


    // update user's information
    async UpdateUser({ username, email, password, _id}) {
        try {
            // only update fields that are not empty

            // username vaidation
            if(username.length > 15) {
                throw new Error("Username must not be longer than 15 characters");
            }

            // password validation
            if(password.length < 8 && password.length > 1) {
                throw new Error("Password must not be less than 8 characters!");
            }

            // update 
            const res = await this.user.UpdateUserUsernameAndEmail(username, email, _id);

            // if(password.length) {
            //     await this.user.UpdateUserEmail(password, _id);
            // }

            if(res) {
                return FormatData({msg: "Successfully updated information", status: 204, username: res.username, email: res.email});
            }
            return FormatData({});
        } catch (error) {
           throw new Error(error) ;
        }
    }

    // get user by username
    async GetFilterByName(userQuery) {
        try {
            const result = await this.user.GetFilterByName(userQuery);
            return FormatData(result);
        } catch (error) {
           throw new Error(error);
        }
    }
}

module.exports = UserService;