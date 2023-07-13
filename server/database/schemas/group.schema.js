const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    message schema will have msg value and the user information.
    the "from" and "to" fields is going to be used to query messages to both users.
    "roomId" will be used for socket connection
*/
const GroupChatSchema = new Schema({
    groupName: String,
    members: [ { type: Schema.Types.ObjectId, ref: 'user', default: [] } ], // will store users that accepted the request to join the group chat
    pendingInvites: [ {type: Schema.Types.ObjectId, ref: 'user' }], // will store userId's of the invited users
    groupAvatar: { type: Schema.Types.String, default: 'uploads/default-group-chat-avatar' },
    messages: [
        {
            msg: Schema.Types.String,
            sender: { type: Schema.Types.ObjectId, ref: 'user' },
            isDeletedBy: [{ type: Schema.Types.ObjectId }],
            reactions: [{ reactor: Schema.Types.ObjectId, reaction: Schema.Types.String }],
            createdAt: Schema.Types.Date
        }
    ],
    roomId: String,
    host: { type: Schema.Types.ObjectId } // group chat creator
}, { timestamps: true });

module.exports = mongoose.model('groupChat', GroupChatSchema);