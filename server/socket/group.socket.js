const { EventMiddleware } = require('../utils/event.middleware');
const { activeSockets } = require('./activeSockets');

module.exports.SocketGroupChat = (socket, io) => {
    // create new group chat
    socket.on('send_request_notification', ({ members, name, hostname }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute function...
            try {
                // loop through members to send each one a notification
                members.forEach(member => {
                    // Emit a notification event to the specific room
                    // Get the recipient's socket ID from connectedUsers map
                    const recipientSocketId = activeSockets.get(member);
                    io.to(recipientSocketId).emit('notification', `${hostname[0].toUppercase() + hostname.slice(1)} send you a request to join ${name} Group Chat`);  // send the updated reactions
                });
            } catch (error) {
                console.log(error);
            }
        }); 
    });
}