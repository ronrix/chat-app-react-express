const { MessageService } = require('../services/');

module.exports.SocketGetMessages = (socket, io) => {
    const service = new MessageService();
    socket.on('get_all_msgs', async (roomId) => {
        console.log("roomId: ", roomId);
        if(roomId) {
            const result = await service.GetMessages(roomId); 
            io.emit('get_all_msgs', {data: result.data[0].messages}); // send an event listener with result value
        }
        socket.emit('get_all_msgs', []); // send an event listener with wth no result
    });

    // sending the msg
    socket.on('send_msg', async ({roomId, msg, userId, idWhereToSend}) => {
        // check requirements
        if(roomId && msg && userId && idWhereToSend) {
            const result = await service.Create({ roomId, msg, userId, idWhereToSend });
            io.emit('get_all_msgs', { data: result?.data?.messages }); // send the new message
        }
    });
}