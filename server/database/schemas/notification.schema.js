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
            groupChatDocId: Schema.Types.ObjectId,
            inviter: { type: Schema.Types.ObjectId, ref: 'user' }, // group chat creator
            requestName: Schema.Types.String,
            action: Schema.Types.Boolean, // false => 'declined', true => 'accepted', null | undefined => 'no action yet' - display action btns
            createdAt: Schema.Types.Date,
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user' }, // id of the recipient
}, { timestamps: true });

module.exports = mongoose.model('requestNotification', RequestNotification);