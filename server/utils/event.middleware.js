const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');

 // Middleware for each event
 // this will prevent the sockets from invoking if the token or authentication has already expired
module.exports.EventMiddleware = async (token, next) => {
    try {
        // Check if the token is valid and not expired
        const isExpired = await jwt.verify(token, APP_SECRET);
        if(isExpired) {
            return next(); // call the next callback function
        }
        // throw error if token is not verified
        throw new Error("Connection failed. Forbidden authentication");
    } catch (error) {
        // If the token is invalid or expired, send an error response
        next(error);
    }
};

