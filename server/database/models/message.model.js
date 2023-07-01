const { MessageSchema } = require('../')

class MessageModel {
    async GetAllMessages(roomId) {
        try {
            const messages = await MessageSchema.findOne({ roomId: roomId });
            console.log(messages);
            return messages;
        } catch (error) {
           throw new Error(error);
        }
    }

    // add new message
    // whereToSend is the "to" field in the message schema
    async CreateMessage({ roomId, msg, userId, idWhereToSend }) {
        try {
            const isMessageExists = await MessageSchema.exists({ roomId: roomId });
            if(isMessageExists) {
                // update the doc, push new message
                const res = await MessageSchema.findOneAndUpdate(
                    { roomId }, 
                    { $push: { messages: { msg: msg, sender: userId, createdAt: Date.now()  } }, },
                    { new: true });
                return res;
            }
            // create new one
            // format data
            const data = {
                roomId, 
                messages: [
                    {
                        msg,
                        sender: userId,
                        createdAt: Date.now(),
                    }
                ],
                from: userId,
                to: idWhereToSend,
            }
            const res = await MessageSchema.create(data);
            return res;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = MessageModel;