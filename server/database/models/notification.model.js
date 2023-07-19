const { NotificationSchema } = require("..");

class NotificationModel {
    async GetNotificationsById(userId) {
        try {
            const result = await NotificationSchema.findOne({ user: userId }).populate({ path: 'notifications.inviter' });

            if (result && result.notifications) {
                // Sort the notifications in descending order based on createdAt field
                result.notifications.sort((a, b) => b.createdAt - a.createdAt);
            }
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = NotificationModel;