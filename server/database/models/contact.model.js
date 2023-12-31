const { ContactSchema } = require('../');

class ContactModel {

    // get all the lists of contacts
    async GetAllContacts(id) {
        try {
            // get contact lists with user reference and message reference
            // user reference for 'from' and 'to' field
            const all = await ContactSchema.findOne({ user: id })
            .populate({
              path: 'contacts.message',
              populate: [
                { path: 'from', select: ['_id', 'username', 'isOnline', 'avatar'], options: { sort: { createdAt: -1 } } },
                { path: 'to', select: ['_id', 'username', 'isOnline', 'avatar'], options: { sort: { createdAt: -1 } } }
              ],
            })
            .exec();

            // sort the contacts in descending order
            all.contacts.sort((a, b) => b.createdAt - a.createdAt);
            // get only contacts that are not deleted
            const res = all.contacts.filter(contact => !contact?.isDeleted);

            return { contacts: res };
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = ContactModel;