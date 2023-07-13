const groupChatSchema = require('../schemas/group.schema');
const requestNotification = require('../schemas/notification.schema');

class GroupChatModel {
    async CreateNewGroupChat({ roomId, members, name, userId }) {
        try {
            const data = {
                roomId,
                groupName: name,
                pendingInvites: members,
                host: userId // store the userId for the host/creator
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
                    await requestNotification.updateOne({ user: member }, { $push: { notifications: { inviter: userId, requestName: name } } });
                    continue;
                }

                // if schema doesn't exists, create new schema
                await requestNotification.create({ user: member, notifications: [{ inviter: userId, requestName: name }] })
            }

            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = GroupChatModel;