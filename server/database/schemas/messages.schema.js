const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    message schema will have msg value and the user information.
    the "from" and "to" fields is going to be used to query messages to both users.
    "roomId" will be used for socket connection
*/
const MessageSchema = new Schema({
    messages: [
        {
            _id: Schema.Types.ObjectId,
            msg: String,
            sender: { type: Schema.Types.ObjectId, ref: 'user', require: false },
            isDeletedBy: [ { type: Schema.Types.ObjectId, ref: 'user', unique: true } ], 
            createdAt: Schema.Types.Date,
        }
    ],
    roomId: String,
    from: { type: Schema.Types.ObjectId, ref: 'user' },  // the receiver of the chat
    to: { type: Schema.Types.ObjectId, ref: 'user' },  // the one who initiated the chat
}, { timestamps: true });

module.exports = mongoose.model('message', MessageSchema);