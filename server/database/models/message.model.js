const { MessageSchema, ContactSchema, UserSchema, NotificationSchema } = require('../')
const mongoose = require('mongoose');

class MessageModel {
    async GetAllMessages(roomId) {
        try {
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

            // create or append to the contact lists of both sender and receiver
            await this.#CheckAndCreateContact(res._id, userId);
            await this.#CheckAndCreateContactToIdWhereToSend(res._id, idWhereToSend);

            // insert notification for the msg receiver
            // await this.#InsertNewNotification(roomId, userId, idWhereToSend);

            return res;
        } catch (error) {
            throw new Error(error);
        }
    }

    // add new message with email
    async CreateNewMessage({ roomId, msg, userId, email }) {
        try {
            const isEmailExists = await UserSchema.exists({ email: email  });
            if(isEmailExists) {
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
                    to: isEmailExists._id,
                }
                const res = await MessageSchema.create(data);

                // create or append to the contact lists of both sender and receiver
                await this.#CheckAndCreateContact(res._id, userId);
                await this.#CheckAndCreateContactToIdWhereToSend(res._id, isEmailExists._id);

                // insert notification for the msg receiver
                // await this.#InsertNewNotification(roomId, userId, isEmailExists._id);

                return res;
            }

            // error if email does not exists
            throw new Error("Email does not exists");
        } catch (error) {
            throw new Error(error.message);
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
        console.log(idWhereTosend)
        try {
            const isContactExist = await ContactSchema.exists({ user: idWhereTosend });

            // check if doc contact exists for this user
            if(isContactExist) {
                console.log("exists...");
                // check if the messageId already exists in the document
                // const exist = await ContactSchema.exists({ user: idWhereToSend, contacts: { $elemMatch: { message: messageId }} });
                // if(!exist) {
                    // update the contact and append the new list
                    await ContactSchema.updateOne({ user: idWhereTosend }, { $push: { contacts: { message: messageId, createdAt: Date.now() } } })
                //     return
                // }
                return;
            }

            // add the message to the contact list if does not exist
            await ContactSchema.create({ user: idWhereTosend, contacts: [ { message: messageId, createdAt: Date.now() } ] });
            return
        } catch (error) {
           throw new Error(error) ;
        }
    }

    // insert new notification
    // userId is the id where to store the notification
    // insert the notification only if user is not in the room
    async #InsertNewNotification(roomId, senderId, userId) {
        try {
            console.log(roomId, senderId, userId);
            // check if the 'userId' has notification table 
            const exists = await NotificationSchema.findOne({ user: userId });

            if(exists) {
                // append the new notification
                await NotificationSchema.updateOne({ user: userId }, { $push: { notifications: { _id: new mongoose.Types.ObjectId(), roomId, senderId, createdAt: Date.now() } } });
                return;
            }
            
            // create new notification table
            const data = {
                user: userId, 
                notifications: [
                    {
                        _id: new mongoose.Types.ObjectId(),
                        roomId,
                        senderId,
                        createdAt: Date.now(),
                    }
                ],
            }
            await NotificationSchema.create(data);
            return ;
        } catch (error) {
            throw new Error(error) ;
        }
    }
}

module.exports = MessageModel;