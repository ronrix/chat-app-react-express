const { ContactService } = require('../services/');
const { activeSockets, usersWhoJoinedRoom } = require('./activeSockets');
const { EventMiddleware } = require('../utils/event.middleware');

module.exports.SocketGetContacts = (socket, io) => {
    const service = new ContactService();
    socket.on('get_all_contacts', async (userId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // no errors - emit the events
            if(userId) {
                try {
                    const result = await service.GetAllContactLists(userId); 
                    socket.emit('get_all_contacts', result); // send an event listener with result value
                } catch (error) {
                    socket.emit('get_all_contacts', []); // send an event listener with wth no result
                }
            }
            socket.emit('get_all_contacts', []); // send an event listener with wth no result

        })
    });

    // store the connected user to activeSockets with their userId and socket.id
    socket.on('store_connected_user', (userId) => {
        EventMiddleware(socket.request.token, async(error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            activeSockets.set(userId, socket.id);
        })
    });

    // store the connected user to the room
    socket.on('store_user_to_room', ({userId, roomId}) => {
         EventMiddleware(socket.request.token, async(error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }
            // execute...
            usersWhoJoinedRoom.push({userId, roomId, socketId: socket.id}); // store the user who joined the room
        });
    });
}