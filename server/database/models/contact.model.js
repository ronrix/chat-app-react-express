const { ContactSchema } = require('../');

class ContactModel {

    // get all the lists of contacts
    async GetAllContacts(id) {
        try {
            // get contact lists with user reference and message reference limited to 10 only
            const all = await ContactSchema.findOne({ user: id })
                .populate('user')
                .populate({path: 'contacts.message', populate: {
                    path: 'from',
                    select: "username"
                }})
                .populate({path: 'contacts.message', populate: {
                    path: 'to',
                    select: "username"
                }}).exec();
            return all;
        } catch (error) {
           throw new Error(error);
        }
    }
}

module.exports = ContactModel;