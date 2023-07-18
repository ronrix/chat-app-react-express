const groupChatSchema = require('../schemas/group.schema');
const userSchema = require('../schemas/user.schema');
const requestNotification = require('../schemas/notification.schema');

class GroupChatModel {
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
                    await requestNotification.updateOne({ user: member }, { $push: { notifications: { inviter: userId, requestName: name, groupChatDocId: result._id } } });
                    continue;
                }

                // if schema doesn't exists, create new schema
                await requestNotification.create({ user: member, notifications: [{ inviter: userId, requestName: name, groupChatDocId: result._id }] })
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
    async GetByRoomId(roomId, userId) {
        try {
            const result = await groupChatSchema.findOne({ roomId, $or: [{ members: userId }, { host: userId }] });
            return result
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
}

module.exports = GroupChatModel;