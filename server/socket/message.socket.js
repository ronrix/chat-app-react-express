const { MessageService, ContactService } = require('../services/');
const connectedUsers = new Map(); // to store user's online status in the rooms

module.exports.SocketGetMessages = (socket, io) => {
    const service = new MessageService();
    const contactService = new ContactService();

    // join room
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
        console.log(`User with joined the room ${data.roomId}`);
        // update user's online status
        connectedUsers.set(data.id, socket.id);
    });

    socket.on('get_all_msgs', async (roomId) => {
        if(roomId) {
            try {
                const result = await service.GetMessages(roomId); 
                socket.emit('get_all_msgs', {data: result.data[0].messages}); // send an event listener with result value
            } catch (error) {
                socket.emit('get_all_msgs', []); // send an event listener with wth no result
            }
        }
        socket.emit('get_all_msgs', []); // send an event listener with wth no result
    });

    // sending the msg with an existing user
    socket.on('send_msg', async ({roomId, msg, userId, idWhereToSend}) => {
        // check requirements
        if(roomId && msg && userId && idWhereToSend) {
            try {
                const result = await service.Create({ roomId, msg, userId, idWhereToSend });
                io.to(roomId).emit('get_all_msgs', { data: result?.data?.messages }); // send the new message

                // get the latest contacts 
                const contacts = await contactService.GetAllContactLists(idWhereToSend); 
                console.log(socket.id, connectedUsers);
                io.to(roomId).emit('get_all_contacts', contacts); // send an event listener with result value

                // Emit a notification event to the specific room
                 // Get the recipient's socket ID from connectedUsers map
                const recipientSocketId = connectedUsers.get(idWhereToSend);

                // Check if the recipient is online
                if (recipientSocketId) {
                    // Emit a notification event to the recipient's socket
                    io.to(recipientSocketId).emit('notification', `New message received` );
                }
                // socket.to(roomId).emit('notification', { msg: 'New message received' });
            } catch (error) {
                io.to(roomId).emit('get_all_msgs', []); // send an event listener with wth no result
            }
        }
    });

    // sending the msg with new user
    socket.on('send_new_msg', async ({roomId, msg, userId, email}) => {
        // check requirements
        if(roomId && msg && userId && email) {
            try {
                const result = await service.NewCreate({ roomId, msg, userId, email });
                io.to(roomId).emit('get_all_msgs', { data: result?.data?.messages }); // send the new message

                // get the latest contacts 
                const contacts = await contactService.GetAllContactLists(result?.data?.to); 
                io.to(roomId).emit('get_all_contacts', contacts); // send an event listener with result value

                // socket.to(roomId).emit('notification', { msg: 'New message received' });
            } catch (error) {
                io.to(roomId).emit('get_all_msgs', []); // send an event listener with wth no result
            }
        }
    });
}