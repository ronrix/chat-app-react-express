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
            roomId: {type: Schema.Types.String },
            senderId: { type: Schema.Types.ObjectId, ref: 'user' }, // id of the user who sends a message
            isViewed: { type: Schema.Types.Boolean, default: false },
            createdAt: Schema.Types.Date,
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user' },  // user who (this doc)  belongs to
}, { timestamps: true });

module.exports = mongoose.model('notification', NotificationSchema );