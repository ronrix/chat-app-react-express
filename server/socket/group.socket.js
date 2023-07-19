const GroupChatService = require('../services/group.service');
const UserService = require('../services/user.service');
const { EventMiddleware } = require('../utils/event.middleware');
const { activeSockets } = require('./activeSockets');

module.exports.SocketGroupChat = (socket, io) => {
    const groupChatService = new GroupChatService();
    const userService  = new UserService();

    // group join room
    socket.on('group_join_room', (roomId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            socket.join(roomId);
            console.log(`User joined the room ${roomId}`);
        })
    });

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
                members?.forEach(member => {
                    // Emit a notification event to the specific room
                    // Get the recipient's socket ID from connectedUsers map
                    const recipientSocketId = activeSockets.get(member);
                    if(recipientSocketId) {
                        io.to(recipientSocketId).emit('notification', `${hostname[0].toUpperCase() + hostname.slice(1)} send you a request to join ${name} Group Chat`);  // send the updated reactions
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }); 
    });

    // get group chat messages
    socket.on('group_messages', (roomId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            if(roomId) {
                try {
                    const result = await groupChatService.GetMessagesByRoomId(roomId, socket.request.user._id); 
                    socket.emit('group_messages', {data: result.data.messages}); // send an event listener with result value
                } catch (error) {
                    socket.emit('group_messages', []); // send an event listener with wth no result
                }
            }
            socket.emit('group_messages', []); // send an event listener with wth no result
        });
    });
    
    // update messages event, this event gets triggered when user accepts the invitation to join group chat
    socket.on('update_group_messages', (docId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            if(docId) {
                try {
                    const result = await groupChatService.GetMessagesByDocId(docId, socket.request.user._id); 
                    io.to(result.data.roomId).emit('group_messages', {data: result.data.messages}); // send an event listener with result value
                } catch (error) {
                    socket.emit('group_messages', []); // send an event listener with wth no result
                }
            }
            socket.emit('group_messages', []); // send an event listener with wth no result
        });
    });

    // get all the group chats
    socket.on('group_chats', () => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            const {data} = await groupChatService.GetAllGroupChat({ userId: socket.request.user._id });
            socket.emit('group_chats', data);
        })
    });

    // send msg
    socket.on('group_send_msg', async ({roomId, msg, userId, groupName}) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute...
            // check requirements
            if(roomId && msg && userId && groupName) {
                try {
                    await groupChatService.InsertMessage({ roomId, msg, userId });

                    // get the proper data messages excluding messages that are deleted
                    const msgsResult = await groupChatService.GetMessagesByRoomId(roomId, socket.request.user._id); 
                    io.to(roomId).emit('group_messages', { data:  msgsResult.data.messages}); // send the new message
                    // update messages of the caller
                    socket.emit('group_messages', { data:  msgsResult.data.messages});

                    // get the latest group chats to broadcast/update all the users that are in the room
                    const groupMessages = await groupChatService.GetAllGroupChat({userId: socket.request.user._id}); 

                    // send an event listener with result value to all users inside the room with 'roomId'
                    io.to(roomId).emit('group_chats', groupMessages); 
                    socket.broadcast.to(roomId).emit('notification', `New message received from group ${groupName}` );
                } catch (error) {
                    io.to(roomId).emit('get_all_msgs', []); // send an event listener with wth no result
                }
            }
        });
    });

    // create message reaction event listner
    socket.on('group_message_react', ({ docId, msgId, reaction, roomId }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute logic
            try {
                const { data } = await groupChatService.InsertReactionOnMsg({ docId, msgId, reaction });

                // send an event listener with result value to the recipient socket
                const reactions = data.messages.find(msg => msg.id === msgId).reactions; // get only the message reactions that was updated
                io.to(roomId).emit('reactions', reactions);  // send the updated reactions to the recipient
                socket.emit('reactions', reactions);  // send the updated reactions to the caller
            } catch (error) {
                console.log(error);
            }
        });
    })

    // delete message reaction event listner
    socket.on('group_delete_react', ({ docId, msgId, reactionId, roomId }) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute logic
            try {
                const { data } = await groupChatService.DeleteReactionOnMsg({ docId, msgId, reactionId });

                const reactions = data.messages.find(msg => msg.id === msgId).reactions; // get only the message reactions that was updated
                io.to(roomId).emit('reactions', reactions);  // send the updated reactions
                socket.emit('reactions', reactions);  // send the updated reactions to the caller
            } catch (error) {
                console.log(error);
            }
        });
    })

    // leave group chat
    socket.on('leave_group', (roomId) => {
        EventMiddleware(socket.request.token, async (error) => {
            // handle error
            if(error) {
                socket.disconnect(); //disconnect the socket
                return;
            }

            // execute logic
            try {
                const { data } = await groupChatService.LeaveGroupChat({ roomId, userId: socket.request.user._id });
                io.to(roomId).emit('group_messages', { data:  data.messages}); // send the new message

                // send notification to all members
                const user = await userService.GetUser(socket.request.user._id);
                io.to(roomId).emit('notification', `${user.username} left the group`);  // send the updated reactions to the caller
            } catch (error) {
                console.log(error);
            }
        });
    })
}