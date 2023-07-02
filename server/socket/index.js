const { Server } = require("socket.io");
const http = require('http');
const { PORT, APP_SECRET } = require("../config");
const { SocketGetContacts } = require("./contact.socket");
const { SocketGetMessages } = require("./message.socket");
const { SocketGetNotification } = require("./notification.socket");
const jwt = require('jsonwebtoken');

module.exports.StartServerWithSocketIO = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    })

    const AuthSocket = async (socket, next) => {
        const token = socket.request?.headers?.cookie?.split(';').filter(c => {
            const cookie = c.split('=');
            if(cookie[0].trim() == '_auth') {
                return c;
            }
        })[0]?.split('=')[1];
        try {
            if(!token) {
                throw new Error('Authentication failed');
            }

            // verify token
            try {
                const verified = await jwt.verify(token, APP_SECRET)
                if(verified) {
                    socket.request.user = verified;
                    return next();
                }
            }
            catch(error) {
                throw new Error('Forbidden');
            }

        } catch (error) {
            // Authentication failed
            // You can handle the unauthenticated case as per your requirement
            // For example, you can send an error message and disconnect the socket
            console.log(error.message);
            // next(error.message)
            next(error.message);
            socket.disconnect(); 
        }
    }

    // apply middleware
    io.use(AuthSocket);

    // initialize connection in socket
    io.on("connection", (socket) => {

        // sockets
        SocketGetContacts(socket, io);
        SocketGetMessages(socket, io);
        SocketGetNotification(socket, io);

        // disconnected
        socket.on('disconnect', (reason) => {
            console.log(`${reason} socket close with id ${socket.id}`);
        })
      
    });

    // listening
    server.listen(PORT, () => console.log(`Server starts at port ${PORT}`));
}