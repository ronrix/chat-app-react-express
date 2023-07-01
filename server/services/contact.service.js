const { ContactModel } = require('../database/models');
const { FormatData } = require('../utils');

class ContactService {
    constructor() {
        this.user = new ContactModel();
    }

    // get all contact lists
    async GetAllContactLists(id) {
        try {
            console.log(id);
            const results = await this.user.GetAllContacts(id);
            return FormatData(results);
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = ContactService;