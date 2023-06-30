const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*  user schema stores user's credentials along with 
    contacts, messages, and notifications
    so that when a user queried, it will return other data it relates
*/
const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    salt: String, // for password hashing
    avatar: String, // url or path to image
    isOnline: Boolean,
    contacts: [{ type: Schema.Types.ObjectId, ref: 'contact', require: true }], 
    messages: [{ type: Schema.Types.ObjectId, ref: 'message', require: true }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'notification', require: true }],
}, 
{ 
     toJSON: { // excludes stated fields on query
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true 
});

module.exports = mongoose.model('user', UserSchema);