const { ContactSchema, UserSchema } = require('../');

class ContactModel {

    // get all the lists of contacts
    async GetAllContacts(id) {
        try {
            // get contact lists with user reference and message reference limited to 10 only
            const all = await ContactSchema.findOne({ user: id })
            .populate({
              path: 'contacts.message',
              populate: [
                { path: 'from', select: ['_id', 'username', 'isOnline'], options: { sort: { createdAt: -1 } } },
                { path: 'to', select: ['_id', 'username', 'isOnline'], options: { sort: { createdAt: -1 } } }
              ],
            })
            .exec();

            // sort the contacts in descending order
            all.contacts.sort((a, b) => b.createdAt - a.createdAt);

            return all;
        } catch (error) {
           throw new Error(error);
        }
    }

    // get the username by id
    async GetUsername(id) {
      try {
        const user = await UserSchema.findById(id);
        return user;
      } catch (error) {
          throw new Error(error);
      }
    }
}

module.exports = ContactModel;