const { Server } = require("socket.io");
const http = require('http');
const { PORT, APP_SECRET } = require("../config");
const { SocketGetContacts } = require("./contact.socket");
const { SocketGetMessages } = require("./message.socket");
const { SocketGetNotification } = require("./notification.socket");
const jwt = require('jsonwebtoken');
const { activeSockets, usersWhoJoinedRoom } = require("./activeSockets");

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

        // disconnect the user from the room
        socket.on('disconnect_from_the_room', ({userId, roomId}) => {
            for(let i=0; i<usersWhoJoinedRoom.length; i++) { // user in the room socket connections
                if(usersWhoJoinedRoom[i].userId === userId && usersWhoJoinedRoom[i].roomId === roomId) {
                    console.log('deleting..');
                    usersWhoJoinedRoom.splice(i, 1);
                    break; // exit the loop after deleting the value
                }
            }
            console.log(usersWhoJoinedRoom);
        })

        // disconnected
        socket.on('disconnect', (reason) => {
            console.log(`${reason} socket close with id ${socket.id}`);

            // delete socket connections
            for(const [key, value] of activeSockets.entries()) { // active socket connections
                if(value === socket.id) {
                    activeSockets.delete(key);
                    break; // exit the loop after deleting the value
                }
            }
            for(let i=0; i<usersWhoJoinedRoom.length; i++) { // user in the room socket connections
                if(usersWhoJoinedRoom[i].socketId === socket.id) {
                    console.log('deleting..');
                    usersWhoJoinedRoom.splice(i, 1);
                    break; // exit the loop after deleting the value
                }
            }
        })
      
    });

    // listening
    server.listen(PORT, () => console.log(`Server starts at port ${PORT}`));
}