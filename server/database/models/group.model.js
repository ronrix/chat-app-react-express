const groupChatSchema = require('../schemas/group.schema');
const userSchema = require('../schemas/user.schema');
const requestNotification = require('../schemas/notification.schema');

class GroupChatModel {

    // insert new message
    async Insert({roomId, msg, userId}) {
        try {
            const result = await groupChatSchema.updateOne({ roomId }, { $push: { messages: { msg, sender: userId, createdAt: Date.now() } }});
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async CreateNewGroupChat({ roomId, members, name, userId }) {
        try {
            const data = {
                roomId,
                groupName: name,
                pendingInvites: members,
                host: userId, // store the userId for the host/creator
            }
            // insert data to db
            const result = await groupChatSchema.create(data);

            // store the notification data to the users who were invited
            // loop through members
            for(const member of members) {
                // check if members already have notification schema 
                const notifExists = await requestNotification.exists({ user: member });
                if(notifExists) {
                    // if schema already exists, just update it with new notification
                    await requestNotification.updateOne({ user: member }, { $push: { notifications: { inviter: userId, requestName: name, groupChatDocId: result._id, createdAt: Date.now() } } });
                    continue;
                }

                // if schema doesn't exists, create new schema
                await requestNotification.create({ user: member, notifications: [{ inviter: userId, requestName: name, groupChatDocId: result._id, createdAt: Date.now() }] })
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // get all groupchats
    async GetAll({ userId }) {
        try {
            const result = await groupChatSchema.find({ $or: [{ members: userId }, { host: userId }] });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // find one by roomId
    async GetMessagesByRoomId(roomId, userId) {
        try {
            const results = await groupChatSchema.findOne({ roomId, $or: [{ members: userId }, { host: userId }] }).populate('messages.sender').populate('messages.reactions.reactor');

            // filter results excluding messages that has "isDeletedBy" value of "userId"
            const formattedResults = results.messages.filter(msg => {
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
            return { messages: formattedResults };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // find one by docId
    async GetMessagesByDocId(docId, userId) {
        try {
            const results = await groupChatSchema.findOne({ _id: docId, $or: [{ members: userId }, { host: userId }] }).populate('messages.sender').populate('messages.reactions.reactor');

            // filter results excluding messages that has "isDeletedBy" value of "userId"
            const formattedResults = results.messages.filter(msg => {
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
            return { messages: formattedResults, roomId: results.roomId };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // accepting request invitation (group chat)
    async Accept({ userId, docId, notifId }) {
        try {
            // update the notification's 'action' 
            const result = await requestNotification.findOneAndUpdate(
                { user: userId, 'notifications._id': notifId }, 
                { $set: { 'notifications.$.action': true }},
                { new: true }).populate({ path: 'notifications.inviter' });

            // update groupchat's 'members' field, pushing this user and pulling out the user from 'pendingInvites' field
            // first check the groupchatSchema if the 'userId' is already in 'members' field
            const exists = await groupChatSchema.exists({ _id: docId, members: userId });
            if(!exists) { // if not 'userId' does not exists, update the schema
                await groupChatSchema.updateOne({ _id: docId }, { $push: { members: userId } });
                await groupChatSchema.updateOne({ _id: docId }, { $pull: { pendingInvites: userId } });

                // get the user and add '{user} join the group' message to the gropu chat
                const user = await userSchema.findOne({ _id: userId });
                await groupChatSchema.updateOne({ _id: docId }, { $push: { messages: { msg: `${user.username} joined the group` } } });
            }
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    // declining request invitation (group chat)
    async Decline({ userId, docId, notifId }) {
        try {
            // update the notification's 'action' 
            const result = await requestNotification.findOneAndUpdate(
                { user: userId, 'notifications._id': notifId }, 
                { $set: { 'notifications.$.action': false }},
                { new: true }).populate({ path: 'notifications.inviter' });

            // removing the user who declines to the 'pendingInvites'
            await groupChatSchema.updateOne({ _id: docId }, { $pull: { pendingInvites: userId } });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // insert new reaction
    async InsertReaction({docId, msgId, reaction}) {
        try {
            const result = await groupChatSchema.findOneAndUpdate(
                { _id: docId, messages: { $elemMatch: { _id: msgId } } }, 
                { $push: { 'messages.$.reactions': reaction } }, 
                { new: true }).populate('messages.reactions.reactor');
                console.log(result);
            return result;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // delete reaction emoji
    async DeleteReaction({docId, msgId, reactionId}) {
        try {
            const result = await groupChatSchema.findOneAndUpdate(
                { _id: docId, messages: { $elemMatch: { _id: msgId } } }, 
                { $pull: { 'messages.$.reactions': { _id: reactionId } } }, 
                { new: true }).populate('messages.reactions.reactor');

            return result;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // get members
    async GetMembers({ userId, docId }) {
        try {
            const result = await groupChatSchema.findOne({ _id: docId, $or: [ { members: userId }, { host: userId}] }).populate('members');
            return result?.members;
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // invite 
    async Invite({ people, docId, userId }) {
        try {
            const usersToBeInvited = [];

            // check if 'people' is already in the 'group chat'
            // store only the 'users' to be invited
            for(const per of people) {
                const userAlreadyExistsInGC = await groupChatSchema.exists({ _id: docId, members: per });
                if(userAlreadyExistsInGC) continue;
                usersToBeInvited.push(per);
            }

            const result = await groupChatSchema.findOneAndUpdate({ _id: docId }, { $push: { pendingInvites: usersToBeInvited } }, { new: true });

            // store the notification data to the users who were invited
            // loop through members
            for(const per of usersToBeInvited) {
                // check if members already have notification schema 
                const notifExists = await requestNotification.exists({ user: per });
                if(notifExists) {
                    // if schema already exists, just update it with new notification
                    await requestNotification.updateOne({ user: per }, { $push: { notifications: { inviter: userId, requestName: result.groupName, groupChatDocId: docId, createdAt: Date.now()} } });
                    continue;
                }

                // if schema doesn't exists, create new schema
                await requestNotification.create({ user: per, notifications: [{ inviter: userId, requestName: result.groupName, groupChatDocId: docId, createdAt: Date.now() }] })
            }

            return { msg: "Successfully sent the invitation", status: 201 };
        } catch (error) {
            throw new Error(error.message) ;
        }
    }

    // leave group chat
    async Leave({ userId, roomId }) {
        try {
            // check if the user (who's going to leave) is the host
            const isUserHost = await groupChatSchema.findOne({ roomId, host: userId });

            if(isUserHost) { 
                // if the leaver is the host, assign the first member user to be the next host
                // by setting new value to the 'host' will automatically remove the user from the groupchat
                await groupChatSchema.updateOne({ roomId }, { host: isUserHost.members[0] })
            }
            else {
                // leave members
                await groupChatSchema.updateOne({ roomId }, { $pull: { members: userId }});
            }


            // push message to the group chat saying user leave the group
            const user = await userSchema.findOne({ _id: userId });
            const result = await groupChatSchema.findOneAndUpdate({ roomId }, { $push: { messages: { msg: `${user.username} left the group` } } }, { new: true }).populate('messages.sender').populate('messages.reactions.reactor');

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = GroupChatModel;