const { MessageModel } = require('../database/models/');
const { GenerateSignature, FormatData } = require('../utils');

class MessageService {
    constructor() {
        this.messages = new MessageModel();
    }

    // get message based on the room id
    async GetMessages(roomId, userId) {
        try {
            const result = await this.messages.GetAllMessages(roomId, userId);
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

    // create new message with file uploading
    async CreateMsgWithFiles({ roomId, msg, userId, idWhereToSend, filenames }) {
        try {
            // replace the msgs "img" src with the filenames
            // the placeholder inside the "msg" is "img_src"
            // the "i" variable is used to properly/orderly assign the src for each img element
            let i = 0;
            const replacedMsg = msg.replace(/img_src/g, (match, index) => {
                const filename = filenames[i];
                i++; // increment the index
                return filename;
            });

            const result = await this.messages.CreateMessage({ roomId, msg: replacedMsg , userId, idWhereToSend });
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

   // delete ia message with message Id
    async DeleteMsg({ messageId, userId }) {
        try {
            const result = await this.messages.DeleteMsg({ messageId, userId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }
}

module.exports = MessageService;
