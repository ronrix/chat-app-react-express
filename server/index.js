const express = require('express');
const { PORT } = require('./config');
const cors = require('cors');
const { user } = require('./api');
const { databaseConnection } = require('./database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const startServer = async () => {
    const app = express();

    // initialize db
    databaseConnection();

    // set up express middlewares
    app.use(cors({ origin: '*' }));
    app.use(bodyParser.json()); // accept json format. like a body parser
    // parse incoming Request Object if object, with nested objects, or generally any type.
    app.use(bodyParser.urlencoded({ extended: true })); 
    // initialize cookie parser
    app.use(cookieParser());

    // api
    user(app);
    // error handling
    // app.use(HandleErrors);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

startServer();