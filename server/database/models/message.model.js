const { MessageSchema, ContactSchema } = require('../')

class MessageModel {
    async GetAllMessages(roomId) {
        try {
            const messages = await MessageSchema.aggregate([
                { $match: { roomId: roomId } }, // match the document with the given roomId
                { $unwind: "$messages" }, // Unwind the messages array
                { $sort: { "messages.createdAt": -1 } } // Sort the messages based on the createdAt field in descending order
            ]);
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
                    { $push: { messages: { msg: msg.trim(), sender: userId, createdAt: Date.now()  } }, },
                    { new: true });

                return res;
            }
            // create new one
            // format data
            const data = {
                roomId, 
                messages: [
                    {
                        msg: msg.trim(),
                        sender: userId,
                        createdAt: Date.now(),
                    }
                ],
                from: userId,
                to: idWhereToSend,
            }
            const res = await MessageSchema.create(data);

            // create the contact since it's a new message
            await this.#CheckAndCreateContact(res._id, userId);

            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // private method
    // append to contact list
    // check if the message is already exists in the contact list
    async #CheckAndCreateContact(messageId, userId) {
        try {
            const isContactExist = await ContactSchema.exists({ user: userId });

            // check if doc contact exists for this user
            if(isContactExist) {
                // check if the messageId already exists in the document
                const exist = await ContactSchema.exists({ user: userId, contacts: { $elemMatch: { message: messageId }} });
                console.log("exist: ", exist);
                if(!exist) {
                    // update the contact and append the new list
                    await ContactSchema.updateOne({ user: userId }, { $push: { contacts: { message: messageId } } })
                    return
                }
                return;
            }

            // add the message to the contact list if does not exist
            await ContactSchema.create({ user: userId, contacts: [ { message: messageId } ] });
            return
        } catch (error) {
           throw new Error(error) ;
        }
    }
}

module.exports = MessageModel;