const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    message schema will have msg value and the user information.
    the "from" and "to" fields is going to be used to query messages to both users.
    "roomId" will be used for socket connection
*/
const RequestNotification = new Schema({
    notifications: [
        {
            inviter: { type: Schema.Types.ObjectId, ref: 'user' }, // group chat creator
            requestName: Schema.Types.String,
            createdAt: Schema.Types.Date,
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user' }, // id of the recipient
    action: Schema.Types.Boolean, // 0 => 'declined', 1 => 'accepted', null => 'no action yet' - display action btns
}, { timestamps: true });

module.exports = mongoose.model('requestNotification', RequestNotification);