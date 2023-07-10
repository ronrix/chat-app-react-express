const { MessageSchema, ContactSchema, UserSchema } = require('../');
const messagesSchema = require('../schemas/messages.schema');

class MessageModel {
    async GetAllMessages(roomId, userId) {
        try {
            // get the messages sorted by date in descending order
            const messages = await MessageSchema.aggregate([
                { $match: { roomId: roomId } },
                { $unwind: "$messages" }, // "unwind" means it will explode or split the messages array
                { $sort: { "messages.createdAt": 1 } }, // sort by date in descending order
                {
                    $group: {
                        _id: "$_id",
                        roomId: { $first: "$roomId" },
                        from: { $first: "$from" },
                        to: { $first: "$to" },
                        messages: { $push: "$messages" }
                    }
                }
            ]);

            // filter results excluding messages that has "isDeletedBy" value of "userId"
            const results = messages[0].messages.filter(msg => {
                // check if isDeletedBy exists. if not just return msg
                // if is exists then only return the messages that are not deleted
                if(msg?.isDeletedBy) {
                    // check if isDeletedBy does not contains value of "userId" then return the value
                    // else don't return any value
                    const isDeletedBy =  msg?.isDeletedBy.map(a => String(a)); // convert ObjectId to String to use "includes" array function
                    if(!isDeletedBy.includes(userId)) { 
                        return msg;
                    }
                }
                else {
                    return msg;
                }
            });

            // return in an array-object format with "messages" property
            return [{ messages: results }];
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
    // roomId is newly generated
    async CreateNewMessage({ roomId, msg, userId, email }) {
        try {
            // check if user exists
            const isEmailExists = await UserSchema.exists({ email: email  });
            if(isEmailExists) {

                // check if user has already contact lists of 'recipient' and 'recipient' already has the contact list of the user

                /* 
                    1. Get the contact lists for userId and the recipient
                    we're doing this because if one connection has deleted their connection or messages with the recipient
                    and when they created new message again with the existing connection
                    we want to just update the message document with new message of this user
                */ 
                const contactListOfBothUsers = await ContactSchema.find({ user: { $in: [userId, isEmailExists._id] } });

                // 2. this will check if the sender and the recipient already have a contact list of each other
                // by looping through and checking them with messageId from 'contactlistOfBothUsers' and 'allContacts'
                let flag = null;
                for(let i=0; i<contactListOfBothUsers[0]?.contacts.length; i++) {
                    for(let j=0; j<contactListOfBothUsers[1]?.contacts.length; j++) {
                        // check
                        if(contactListOfBothUsers[0]?.contacts[i]?.message.toString() === contactListOfBothUsers[1]?.contacts[j]?.message.toString()) {
                            flag = i; // we can set i or j here to get the index of the match contact list
                            break;
                        }
                    }
                }

                // check, if flag is not 0 then it means there's already a connection between the two user then
                // we can now update the "message" document with new message that we will send
                // without appending or creating new contact list for both users
                if(flag !== null)  {
                    // get the message id of the contact lists to use for finding and updating the 
                    // existing message document
                    const messageId = contactListOfBothUsers[0].contacts[flag].message;

                    // update the message document with new message
                    const res = await MessageSchema.findOneAndUpdate(
                        { _id: messageId }, 
                        { $push: { messages: { msg: msg.trim(), sender: userId, createdAt: Date.now()  } } },
                        { new: true });

                    /* 
                        lastly, we would update the contact lists of the user in which this contact/connection has been deleted.
                        we would update it to false now so it would show up again to the contacts lists of the user
                    */
                    await ContactSchema.updateOne({ user: userId, 'contacts.message': messageId }, { $set: { 'contacts.$.isDeleted': false } } );

                    return res; // return now with response
                }

                // if no matchingContacts for both that means it's their first time messaging each other
                // so will create new message document with roomId
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

                return res; // return with response
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
    // instead of delete the message document, i only want to delete the contact lists for the users who call it
    // for like "safe delete" thingy
    async DeleteMsg({ messageId, userId }) {
        try {
            // update contacts docs contacts array field containing the messageId
            // making isDeleted to true. this will be handled in the client.
            // the contact will not get displayed if the 'isDeleted' is true
            const result = await ContactSchema.updateOne(
                { user: userId, 'contacts.message': messageId },
                { $set: { "contacts.$.isDeleted": true } },
                { new: true }
            );
            // now update the message docs setting 'isDeleted' and push the userId of the one who calls it, if the senderId is equal to userId that was passed in
            await MessageSchema.updateMany(
                { _id: messageId },
                { $push: { "messages.$[].isDeletedBy": userId } },
            )

            if(result?.modifiedCount) {
                return { msg: 'Successfully deleted', status: 204 };
            }
            throw new Error("Failed to delete the contact");
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // insert new reaction
    async InsertReaction({docId, msgId, reaction}) {
        try {
            const result = await messagesSchema.findOneAndUpdate(
                { _id: docId, messages: { $elemMatch: { _id: msgId } } }, 
                { $push: { 'messages.$.reactions': reaction } }, 
                { new: true });
            return result;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // delete reaction emoji
    async DeleteReaction({docId, msgId, reactionId}) {
        try {
            console.log(reactionId);
            const result = await messagesSchema.findOneAndUpdate(
                { _id: docId, messages: { $elemMatch: { _id: msgId } } }, 
                { $pull: { 'messages.$.reactions': { _id: reactionId } } }, 
                { new: true });

            return result;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }
}

module.exports = MessageModel;