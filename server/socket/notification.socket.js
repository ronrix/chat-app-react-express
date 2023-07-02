const { NotificationService } = require('../services/');

module.exports.SocketGetNotification = (socket, io) => {
    const service = new NotificationService();

    // get notifications
    socket.on('notifications', async (userId) => {
       const notifications = await service.GetAllNotifications(userId);
       io.emit('notifications', notifications);
    });

    // view notification
    socket.on('view_notification', async ({userId, notifId}) => {
       const notifications = await service.ViewNotification(userId, notifId);
       socket.emit('notifications', notifications.data);
    });
}