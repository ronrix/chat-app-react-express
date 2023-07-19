const { NotificationService } = require('../services');
const { EventMiddleware } = require('../utils/event.middleware');
const { activeSockets } = require('./activeSockets');

module.exports.SocketNofification = (socket, io) => {
    const notificationService = new NotificationService();

    // create new group chat
    socket.on('notifications', (userId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute function get the notifications of the user...
            try {
                const { data } = await notificationService.GetNotifications(userId);

                // send data to sockets 'userId'
                const recipientSocketId = activeSockets.get(userId);
                if(recipientSocketId) {
                    io.to(recipientSocketId).emit('notifications', data);
                }
            } catch (error) {
                socket.emit('notifications', []); // send empty data
            }
        }); 
    });
}