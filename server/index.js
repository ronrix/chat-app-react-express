const express = require('express');
const cors = require('cors');
const { user, chat, groupChat } = require('./api');
const { databaseConnection } = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { StartServerWithSocketIO } = require('./socket');

const startServer = async () => {
    const app = express();

    // initialize db
    await databaseConnection();

    // set up express middlewares
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    app.use(bodyParser.json()); // accept json format. like a body parser
    // parse incoming Request Object if object, with nested objects, or generally any type.
    app.use(bodyParser.urlencoded({ extended: true })); 
    // initialize cookie parser
    app.use(cookieParser());
    // define the route for serving images
    app.use('/uploads', express.static('uploads'));

    // apis
    user(app);
    chat(app);
    groupChat(app)

    // start socket connection
    StartServerWithSocketIO(app);

}

startServer();