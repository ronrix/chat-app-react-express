const { UPLOAD } = require("../config");
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

    // upload avatar
    app.post('/upload/image', [ValidateToken, UPLOAD.single('avatar')], async (req, res) => {
        try {
            let filename = null;
            if(req.file) {
                filename = req.file.filename; // access the filename property to get the uploaded avatar's filename
            }
            const { _id } = req.user; // get the user id
            // store the filename in the database
            const result = await service.UpdateAvatar({ filename, userId: _id });
            const avatar = filename ? `uploads/${filename}` : 'uploads/default-avatar.jpg';
            return res.json({ ...result, avatar }); // return the result
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    });

    // Logout
    app.get('/signout', [ValidateToken], async (req, res) => {
        try {
            const token = req.cookies._auth; // get the cookie first
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
            const { _id } = req.user;
            const user = await service.GetUser(_id);
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

    // get all users for display
    app.get('/users', [ValidateToken], async (req, res) => {
        try {
            const { _id }  = req.user; // get the id of the user
            const {data} = await service.GetAllUsers(_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(400) .json({msg: error.message});
        }
    });

    // update user/profile information
    app.put('/user/update-info', [ValidateToken], async (req, res) => {
        try {
            const { _id } = req.user; // get user id
            const { username, email, password } = req.body; // get all the fiels
            const result = await service.UpdateUser({ username, email, password, _id });
            console.log(result);
            return res.json(result);
        } catch (error) {
            return res.status(400) .json({msg: error.message});
        }
    });

    // get user by username
    app.get('/user/:userQuery', [ValidateToken], async (req, res) => {
        try {
            const { userQuery } = req.query;
            const result = await service.GetFilterByName(userQuery);
            return res.json(result);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    });

}