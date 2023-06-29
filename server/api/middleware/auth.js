const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.headers.cookie['bearer'];
    const isAuthorized = await jwt.verify(token);

    if(isAuthorized) {
        return next(); // call the api
    }

    // unauthorized access 
    return res.status(403).json({ messages: 'Not Authorized '});
}