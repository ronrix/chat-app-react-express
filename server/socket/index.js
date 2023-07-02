const { Server } = require("socket.io");
const http = require('http');
const { PORT } = require("../config");
const { SocketGetContacts } = require("./contact.socket");
const { SocketGetMessages } = require("./message.socket");

module.exports.StartServerWithSocketIO = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    })

    // initialize connection in socket
    io.on("connection", (socket) => {

        // sockets
        SocketGetContacts(socket, io);
        SocketGetMessages(socket, io);

        // disconnected
        socket.on('disconnection', () => {
            console.log(`socket close with id ${socket.id}`);
        })
      
    });

    // listening
    server.listen(PORT, () => console.log(`Server starts at port ${PORT}`));
}