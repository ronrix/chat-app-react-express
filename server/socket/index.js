const { Server } = require("socket.io");
const http = require('http');
const { PORT, APP_SECRET } = require("../config");
const { SocketGetContacts } = require("./contact.socket");
const { SocketGetMessages } = require("./message.socket");
const jwt = require('jsonwebtoken');
const { activeSockets, usersWhoJoinedRoom } = require("./activeSockets");
const { SocketGroupChat } = require("./group.socket");
const { SocketNofification } = require("./notification.socket");

module.exports.StartServerWithSocketIO = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"]
    })

    const AuthSocket = async (socket, next) => {
        try {
            // get the token auth
            const token = socket.request?.headers?.cookie?.split(';').filter(c => {
                const cookie = c.split('=');
                if(cookie[0].trim() == '_auth') {
                    return c;
                }
            })[0]?.split('=')[1];

            // check if token exists, throw error if not exists
            if(!token) {
                throw new Error('Authentication failed');
            }

            // verify the token, if verified call the next() middleware
            try {
                const verified = await jwt.verify(token, APP_SECRET)
                if(verified) {
                    socket.request.user = verified; // store the user data
                    socket.request.token = token; // store the token
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
            next(new Error(error));
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
        SocketGroupChat(socket, io);
        SocketNofification(socket, io);

        // disconnect the user from the room
        socket.on('disconnect_from_the_room', ({userId, roomId}) => {
            for(let i=0; i<usersWhoJoinedRoom.length; i++) { // user in the room socket connections
                // delete the user from the "usersWhoJoinedRoom" state
                if(usersWhoJoinedRoom[i].userId === userId && usersWhoJoinedRoom[i].roomId === roomId) {
                    usersWhoJoinedRoom.splice(i, 1);
                    break; // exit the loop after deleting the value
                }
            }
        })

        // socket disconnect event
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
                // delete the user from the "usersWhoJoinedRoom" state
                if(usersWhoJoinedRoom[i].socketId === socket.id) {
                    usersWhoJoinedRoom.splice(i, 1);
                    break; // exit the loop after deleting the value
                }
            }
        })
      
    });

    // listening
    server.listen(PORT, () => console.log(`Server starts at port ${PORT}`));
}