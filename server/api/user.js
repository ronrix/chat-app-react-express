const { UserService, ContactService } = require("../services");
const { DecodeToken, ValidateToken } = require("../utils");

module.exports = (app) => {
    const service = new UserService();
    const contactService = new ContactService();

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
            return res.status(400).json({ msg: error.message });
        }
    });

    // sign up
    app.post('/register', async (req, res) => {
        try {
            const { email, password, username } = req.body;
            const {data} = await service.Register({email, username, password});
            // store token in cookie and httpOnly format
            res.cookie('session', data?.token, { maxAage: 21600, httpOnly: true });
            // return token and id
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ msg: error.message });
        }
    });

    // Logout
    app.get('/signout', [ValidateToken], async (req, res) => {
        try {
            const token = req.cookies['session']; // get the cookie first
            const { _id } = await DecodeToken(token);
            // making the isOnline field false
            const { data } = await service.Signout(_id); 
            res.clearCookie("session"); // clear the session cookie
            res.clearCookie("userId"); // clear the session cookie

            return res.status(200).json(data);
        } catch (error) {
           return res.status(400).json({msg: error.message});
        }
    });

    // get the user
    app.get('/user', [ValidateToken], async (req, res) => {
        try {
            const userId = req.cookies.userId;
            const user = await service.GetUser(userId);
            if(user) {
                return res.status(200).json({ id: user.data._id, username: user.data.username, msg: 'Success' });
            }
            throw new Error('No user found!');
        } catch (error) {
            // clear the cookies
            res.clearCookie("session"); // clear the session cookie
            res.clearCookie("userId"); // clear the session cookie
            return res.status(400) .json({msg: error.message});
        }
    });

    // contact lists
    app.get('/contacts', [ValidateToken], async (req, res) => {
        try {
            const { _id } = req.user; // get the id of the user session
            const contacts = await contactService.GetAllContactLists(_id);
            return res.status(200).json(contacts);
        } catch (error) {
            return res.status(400) .json({msg: error.message});
        }
    });
}