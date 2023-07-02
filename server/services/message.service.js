const { MessageModel } = require('../database/models/');
const { GenerateSignature, FormatData } = require('../utils');

class MessageService {
    constructor() {
        this.messages = new MessageModel();
    }

    // get message based on the room id
    async GetMessages(roomId) {
        try {
            const result = await this.messages.GetAllMessages(roomId);
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // create new message
    async Create({ roomId, msg, userId, idWhereToSend }) {
        try {
            const result = await this.messages.CreateMessage({ roomId, msg, userId, idWhereToSend });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }

   // create new message with email
    async NewCreate({ roomId, msg, userId, email }) {
        try {
            const result = await this.messages.CreateNewMessage({ roomId, msg, userId, email });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }
}

module.exports = MessageService;
