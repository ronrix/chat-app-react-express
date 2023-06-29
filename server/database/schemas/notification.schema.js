const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    any user has a notification feature that when someone message them, 
    it will be populated so they can have notification history
*/
const NotificationSchema = new Schema({
    notifications: [
        {
            _id: Schema.Types.ObjectId, 
            msg: String,
            createdAt: Schema.Types.Date,
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user' }, 
}, { timestamps: true });

module.exports = mongoose.model('notification', NotificationSchema );