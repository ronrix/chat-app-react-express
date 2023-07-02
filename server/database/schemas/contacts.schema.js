const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    contact lists by storing the ids of the contacted usesr
*/
const ContactSchema = new Schema({
    contacts: [
        {
            message: { type: Schema.Types.ObjectId, ref: 'message' }, // message id
            createdAt: { type: Schema.Types.Date }, 
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user' },  // reference of the user 
}, { timestamps: true });

module.exports = mongoose.model('contacts', ContactSchema);