const { MessageService, ContactService, UserService } = require('../services/');
const { activeSockets, usersWhoJoinedRoom } = require('./activeSockets');
const { EventMiddleware } = require('../utils/event.middleware');

module.exports.SocketGetMessages = (socket, io) => {
    const service = new MessageService();
    const contactService = new ContactService();
    const userService = new UserService();

    // join room
    socket.on('join_room', (data) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            socket.join(data.roomId);
            console.log(`User with joined the room ${data.roomId}`);
        })
    });

    // get all the msgs event
    socket.on('get_all_msgs', async (roomId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            if(roomId) {
                try {
                    const result = await service.GetMessages(roomId, socket.request.user._id); 
                    socket.emit('get_all_msgs', {data: result.data[0].messages}); // send an event listener with result value
                } catch (error) {
                    socket.emit('get_all_msgs', []); // send an event listener with wth no result
                }
            }
            socket.emit('get_all_msgs', []); // send an event listener with wth no result
        });
    });

    // get the updated messages
    // this gets invoked only when the chat msg is too long, which means the sender is sending an image
    // this evnet is doing the same as 'send_msg' event. which sends a notification and updated msgs
    socket.on('get_msgs_update', async ({ roomId, idWhereToSend, userId, username }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            // check requirements
            if(roomId && userId && idWhereToSend && username) {
                try {
                    const result = await service.GetMessages(roomId, socket.request.user._id); 
                    io.to(roomId).emit('get_all_msgs', {data: result.data[0].messages}); // send an event listener with result value

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
    })

    // sending the msg with an existing user
    socket.on('send_msg', async ({roomId, msg, userId, idWhereToSend, username}) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            // check requirements
            if(roomId && msg && userId && idWhereToSend) {
                try {
                    await service.Create({ roomId, msg, userId, idWhereToSend });

                    // get the proper data messages excluding messages that are deleted for this user
                    const msgsResult = await service.GetMessages(roomId, socket.request.user._id); 
                    io.to(roomId).emit('get_all_msgs', { data:  msgsResult.data[0].messages}); // send the new message

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
    });

    // sending the msg with new user
    socket.on('send_new_msg', async ({roomId, msg, userId, email}) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            // check requirements
            if(roomId && msg && userId && email) {
                try {
                    const { data } = await service.NewCreate({ roomId, msg, userId, email });

                    // get the idWhereToSend from the result
                    // if the userId is not equal to "to" for "from" field store the later
                    const idWhereToSend = data?.to === userId ? data?.from : data?.to;

                    // get the username 
                    const { data: user } = await userService.GetUser(userId);

                    // get the updated contacts
                    const contacts = await contactService.GetAllContactLists(idWhereToSend.toString()); 


                    // Emit a notification event to the specific room
                    // Get the recipient's socket ID from connectedUsers map
                    const recipientSocketId = activeSockets.get(idWhereToSend.toString());
                    // send an event listener with result value to the recipient socket
                    io.to(recipientSocketId).emit('get_all_contacts', contacts);  // send the updated contacts
                    io.to(recipientSocketId).emit('notification', `New message received from ${user?.username}` ); // send the notification

                    // send a response message to the client who calls it
                    socket.emit('send_new_msg_response', { msg: "Message sent", status: 201 });
                } catch (error) {
                    io.to(roomId).emit('get_all_msgs', []); // send an event listener with wth no result

                    // send a response message to the client who calls it
                    socket.emit('send_new_msg_response', { msg: "Message didn't send, " + error.message, status: 404 });
                }
            }
        });
    });

    // create message reaction event listner
    socket.on('message_react', ({ docId, msgId, reaction }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute logic
            try {
                const { data } = await service.InsertReactionOnMsg({ docId, msgId, reaction });

                // get the idWhereToSend from the result
                // if the userId is not equal to "to" for "from" field store the later
                const idWhereToSend = data?.to === socket.request.user._id ? data?.from : data?.to;

                // get the username 
                const { data: user } = await userService.GetUser(socket.request.user._id);

                // Emit a notification event to the specific room
                // Get the recipient's socket ID from connectedUsers map
                const recipientSocketId = activeSockets.get(idWhereToSend.toString());
                io.to(recipientSocketId).emit('notification', `New message received from ${user?.username}` ); // send the notification

                // send an event listener with result value to the recipient socket
                const reactions = data.messages.find(msg => msg.id === msgId).reactions; // get only the message reactions that was updated
                io.to(recipientSocketId).emit('reactions', reactions);  // send the updated reactions to the recipient
                socket.emit('reactions', reactions);  // send the updated reactions to the caller
            } catch (error) {
                console.log(error);
            }
        });
    })

    // delete message reaction event listner
    socket.on('delete_react', ({ docId, msgId, reactionId }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute logic
            try {
                const { data } = await service.DeleteReactionOnMsg({ docId, msgId, reactionId });

                // get the idWhereToSend from the result
                // if the userId is not equal to "to" for "from" field store the later
                const idWhereToSend = data?.to === socket.request.user._id ? data?.from : data?.to;

                // Emit a notification event to the specific room
                // Get the recipient's socket ID from connectedUsers map
                const recipientSocketId = activeSockets.get(idWhereToSend.toString());

                // send an event listener with result value to the recipient socket
                const reactions = data.messages.find(msg => msg.id === msgId).reactions; // get only the message reactions that was updated
                io.to(recipientSocketId).emit('reactions', reactions);  // send the updated reactions
                socket.emit('reactions', reactions);  // send the updated reactions to the caller
            } catch (error) {
                console.log(error);
            }
        });
    })
}