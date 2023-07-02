const { NotificationModel } = require('../database/models');
const { FormatData } = require('../utils');

class NotificationService {
    constructor() {
        this.notification = new NotificationModel();
    }

    // get all contact lists
    async GetAllNotifications(id) {
        try {
            const results = await this.notification.GetAllNotifications(id);
            return results;
        } catch (error) {
            throw new Error(error);
        }
    }

    // update the view field of the notification
    async ViewNotification(userId, notifId) {
        try {
            const result = await this.notification.View(userId, notifId);
            return FormatData(result);
        } catch (error) {
           throw new Error(error);
        }
    }

}

module.exports = NotificationService;