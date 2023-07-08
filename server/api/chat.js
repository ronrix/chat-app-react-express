const multer = require("multer");
const { UPLOAD, BACKEND_URL } = require("../config");
const { MessageService } = require("../services");
const { ValidateToken } = require("../utils");

module.exports = (app) => {
    const message = new MessageService();

    // Get Messages
    app.get('/messages', [ValidateToken] , async (req, res) => {
        try {
            const { roomId } = req.query; // get he room id from the query
            const messages = await message.GetMessages(roomId);
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(400).json({msg: error.message});
        }
    });

    // Create Message
    app.post('/message/create', [ValidateToken, UPLOAD.any()], async (req, res) => {
        try {
            const { roomId, msg, userId, idWhereToSend } = req.body;
            // get the images filename to store in the db
            let filenames = [];
            if(req.files) {
                // get only filename of the images from req.files
                // this will be the one that will be stored in the db
                filenames = req.files.map(file => BACKEND_URL + "uploads/" + file.filename); 
            }
            const result = await message.CreateMsgWithFiles({ roomId, msg, userId, idWhereToSend, filenames });
            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({msg: error.message});
        }
    },  (err, req, res, next) => { // handles error message
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_COUNT') {
            // Handle the "Too many files" error
            res.status(400).json({ msg: 'Too many files uploaded. (maximum: 3)' });
        } else {
            // Handle other errors
            res.status(500).json({ msg: 'Internal server error' });
        }
    })

    // Create New Message
    app.post('/message/new/create', [ValidateToken], async (req, res) => {
        try {
            const { roomId, msg, userId, email } = req.body;
            const result = await message.NewCreate({ roomId, msg, userId, email });
            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({msg: error.message});
        }
    })

    // delete a message
    app.delete('/message/delete', [ValidateToken], async (req, res) => {
        try {
            const { _id } = req.user;
            const { messageId } = req.body; // get the message id
            const result = await message.DeleteMsg({ messageId, userId: _id });
            return res.json(result); // send 204 code "update/delete successfully"
        } catch (error) {
            return res.status(400).json({msg: error.message});
        }
    })

}