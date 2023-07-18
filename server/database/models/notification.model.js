const notificationSchema = require('../schemas/notification.schema');

class NotificationModel {
    async GetNotificationsById(userId) {
        try {
            const result = await notificationSchema.findOne({ user: userId }).populate({ path: 'notifications.inviter' });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = NotificationModel;