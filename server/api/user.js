const UserService = require("../services/user.service");
const { DecodeToken } = require("../utils");

module.exports = (app) => {
    const service = new UserService();

    // Login
    app.post('/signin', async (req, res) => {
        try {
            const { email, password } = req.body;
            const { data } = await service.Signin({email, password});

            if(data?.token) {
                // store token in cookie and httpOnly format
                res.cookie('session', data?.token, { maxAage: 21600, httpOnly: true });
                // return token and id
                return res.status(200).json(data);
            }

            // return error response
            return res.status(400).json({ msg: 'Email or password is incorrect!' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error.message });
        }
    });

    // Logout
    app.get('/signout', async (req, res) => {
        try {
            const token = req.cookies['session']; // get the cookie first
            const { _id } = await DecodeToken(token);
            // making the isOnline field false
            console.log('hey');
            const { data } = await service.Signout(_id); 
            console.log('hey1')
            res.clearCookie("session"); // clear the session cookie

            return res.status(200) .json(data);
        } catch (error) {
            
        }
    });
}