const { ContactService } = require('../services/');

module.exports.SocketGetContacts = (socket, io) => {
    const service = new ContactService();
    socket.on('get_all_contacts', async (userId) => {
        if(userId) {
            try {
                const result = await service.GetAllContactLists(userId); 
                io.emit('get_all_contacts', result); // send an event listener with result value
            } catch (error) {
                io.emit('get_all_contacts', []); // send an event listener with wth no result
            }
        }
        io.emit('get_all_contacts', []); // send an event listener with wth no result
    });
}