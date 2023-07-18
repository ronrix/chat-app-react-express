const { NotificationModel } = require('../database/models'); 
const { FormatData } = require('../utils');

class NotificationService {
    constructor() {
        this.notification = new NotificationModel();
    }
    async GetNotifications(userId) {
        try {
            const result = await this.notification.GetNotificationsById(userId);
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = NotificationService;