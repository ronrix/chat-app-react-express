const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
    contact lists by storing the ids of the contacted usesr
*/
const ContactSchema = new Schema({
    contacts: [
        {
            _id: Schema.Types.ObjectId
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'user', require: true },  // reference of the user 
}, { timestamps: true });

module.exports = mongoose.model('contacts', ContactSchema);