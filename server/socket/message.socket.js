const { MessageService, ContactService } = require('../services/');
const { activeSockets, usersWhoJoinedRoom } = require('./activeSockets');

module.exports.SocketGetMessages = (socket, io) => {
    const service = new MessageService();
    const contactService = new ContactService();

    // join room
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
        console.log(`User with joined the room ${data.roomId}`);
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
    socket.on('send_msg', async ({roomId, msg, userId, idWhereToSend, username}) => {
        // check requirements
        if(roomId && msg && userId && idWhereToSend) {
            try {
                const result = await service.Create({ roomId, msg, userId, idWhereToSend });
                io.to(roomId).emit('get_all_msgs', { data: result?.data?.messages }); // send the new message

                // get the latest contacts 
                const contacts = await contactService.GetAllContactLists(idWhereToSend); 

                // Emit a notification event to the specific room
                 // Get the recipient's socket ID from connectedUsers map
                const recipientSocketId = activeSockets.get(idWhereToSend);
                // send an event listener with result value to the recipient socket
                io.to(recipientSocketId).emit('get_all_contacts', contacts); 

                // check if the recipient and the user are in the same room
                const isBothJoinedIn = usersWhoJoinedRoom.find(el => el.userId === idWhereToSend)?.roomId === usersWhoJoinedRoom.find(el => el.userId === userId)?.roomId;
                if(isBothJoinedIn) { // if both are in the room don't send a notif
                    return;
                }
                // send the notification if one is not in the room
                if (recipientSocketId) {
                    // Emit a notification event to the recipient's socket
                    io.to(recipientSocketId).emit('notification', `New message received from ${username}` );
                }
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
                const { data } = await service.NewCreate({ roomId, msg, userId, email });

                // get the idWhereToSend from the result
                // if the userId is not equal to "to" for "from" field store the later
                const idWhereToSend = data?.to === userId ? data?.from : data?.to;

                // get the username 
                const { data: user } = await contactService.GetUsername(userId);

                // get the updated contacts
                const contacts = await contactService.GetAllContactLists(idWhereToSend.toString()); 


                // Emit a notification event to the specific room
                 // Get the recipient's socket ID from connectedUsers map
                const recipientSocketId = activeSockets.get(idWhereToSend.toString());
                // send an event listener with result value to the recipient socket
                io.to(recipientSocketId).emit('get_all_contacts', contacts);  // send the updated contacts
                io.to(recipientSocketId).emit('notification', `New message received from ${user?.username}` ); // send the notification
            } catch (error) {
                io.to(roomId).emit('get_all_msgs', []); // send an event listener with wth no result
            }
        }
    });
}