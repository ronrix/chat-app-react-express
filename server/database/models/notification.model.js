const {  NotificationSchema } = require('..');

class NotificationModel {

    // get all notifications
    async GetAllNotifications(id) {
        try {
            if(!id) return []; // if no id, return empty array
            const result = await NotificationSchema.findOne(
                { user: id }
                ).populate('notifications.senderId') // get the notifications by iD
                .sort({ createdAt: 1 }); // sort by date in descending order

            // sort by date in descending order
            if (result && result.notifications) {
                result.notifications.sort((a, b) => b.createdAt - a.createdAt);
            }

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    // view the notification
    async View(userId, notifId) {
        try {
            await NotificationSchema.updateOne(
                { user: userId, "notifications._id": notifId }, 
                { $set: { "notifications.$.isViewed": true } },
                { new: true }
            ); // get the notifications by id

            // get the update notification
            const result = await NotificationSchema.findOne(
                { user: userId }
                ).populate('notifications.senderId') // get the notifications by iD
                .sort({ createdAt: 1 }); // sort by date in descending order

            // sort by date in descending order
            if (result && result.notifications) {
                result.notifications.sort((a, b) => b.createdAt - a.createdAt);
            }

            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = NotificationModel;