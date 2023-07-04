const { MessageSchema, ContactSchema, UserSchema, NotificationSchema } = require('../')
const mongoose = require('mongoose');

class MessageModel {
    async GetAllMessages(roomId) {
        try {
            // get the messages sorted by date in descending order
            const messages = await MessageSchema.aggregate([
                { $match: { roomId: roomId } }, // match the document with the given roomId
                { $unwind: "$messages" }, // Unwind the messages array
                { $sort: { "messages.createdAt": 1 } }, // Sort the messages based on the createdAt field in descending order
                {
                    $group: {
                    _id: "$_id",
                    roomId: { $first: "$roomId" },
                    from: { $first: "$from" },
                    to: { $first: "$to" },
                    messages: { $push: "$messages" }
                    }
                },
                {
                    $project: {
                    _id: 1,
                    roomId: 1,
                    from: 1,
                    to: 1,
                    messages: 1
                    }
                }
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
            // check if room already exists
            const isMessageExists = await MessageSchema.exists({ roomId: roomId });
            if(isMessageExists) {
                // update the doc, push new message
                const res = await MessageSchema.findOneAndUpdate(
                    { roomId }, 
                    { $push: { messages: { msg: msg.trim(), sender: userId, createdAt: Date.now()  } }, },
                    { new: true });

                  return res;
            }

            // if room does not exists yet
            // create new message document with roomId

            const data = { // format the data to be inserted or created with MessageSchema
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
            const res = await MessageSchema.create(data); // create new "message" room

            // create or append to the contact lists of both sender and receiver
            await this.#CheckAndCreateContact(res._id, userId);
            await this.#CheckAndCreateContactToIdWhereToSend(res._id, idWhereToSend);

            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // add new message with email
    async CreateNewMessage({ roomId, msg, userId, email }) {
        try {
            // check if user exists
            const isEmailExists = await UserSchema.exists({ email: email  });
            if(isEmailExists) {
                // if user exists create new message document with roomId
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
                    to: isEmailExists._id,
                }
                const res = await MessageSchema.create(data);

                // create or append to the contact lists of both sender and receiver
                await this.#CheckAndCreateContact(res._id, userId);
                await this.#CheckAndCreateContactToIdWhereToSend(res._id, isEmailExists._id);

                return res;
            }

            // error if email does not exists
            throw new Error("User does not exists");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // private method
    // append to contact list
    // check if the message is already exists in the contact list
    async #CheckAndCreateContact(messageId, userId) {
        try {
            // check if doc contact exists for this user
            const isContactExist = await ContactSchema.exists({ user: userId });
            if(isContactExist) {
                // check if the messageId already exists in the messages array of "contacts" document
                const exist = await ContactSchema.exists({ user: userId, contacts: { $elemMatch: { message: messageId }} });
                if(!exist) {
                    // update the contact and append the new list
                    await ContactSchema.updateOne({ user: userId }, { $push: { contacts: { message: messageId, createdAt: Date.now() } } })
                    return
                }
                return;
            }

            // add the message to the contact list if does not exist
            await ContactSchema.create({ user: userId, contacts: [ { message: messageId, createdAt: Date.now() } ] });
            return
        } catch (error) {
           throw new Error(error) ;
        }
    }

    // private method
    // append or create new contact to the list of the "idWhereToSend"
    async #CheckAndCreateContactToIdWhereToSend(messageId, idWhereTosend) {
        try {
            // check if doc contact exists for the user "idWhereToSend" or the "recipient"
            const isContactExist = await ContactSchema.exists({ user: idWhereTosend });
            if(isContactExist) {
                // update the contact and append the new list
                await ContactSchema.updateOne({ user: idWhereTosend }, { $push: { contacts: { message: messageId, createdAt: Date.now() } } })
                return;
            }

            // add the message to the contact list if does not exist
            await ContactSchema.create({ user: idWhereTosend, contacts: [ { message: messageId, createdAt: Date.now() } ] });
            return
        } catch (error) {
           throw new Error(error) ;
        }
    }

    // delete a message with provided message id
    // instead of delete the message document, i only want to delete the contact lists for each users
    // for like "safe delete" thingy
    async DeleteMsg({ messageId }) {
        try {
            // update contacts docs contacts array field containing the messageId
            const result = await ContactSchema.updateMany(
                { 'contacts': { $elemMatch: { "message": { $eq: messageId } } } },
                { "$pull": { "contacts": { "message": messageId } } },
                { new: true }
            );
            if(result?.modifiedCount) {
                console.log('deleting...');
                return { msg: 'Successfully deleted', status: 204 };
            }
        } catch (error) {
           throw new Error(error) ;
        }
    }
}

module.exports = MessageModel;