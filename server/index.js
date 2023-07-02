const express = require('express');
const { PORT } = require('./config');
const cors = require('cors');
const { user, chat, notification } = require('./api');
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

    // api
    user(app);
    chat(app);
    notification(app);

    // error handling
    // app.use(HandleErrors);

    // start socket connection
    StartServerWithSocketIO(app);

//     app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
//     .on('error', (err) => {
//         console.log(err);
//         process.exit();
//     })
}

startServer();