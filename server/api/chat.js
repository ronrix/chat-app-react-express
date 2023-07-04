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
    app.post('/message/create', [ValidateToken], async (req, res) => {
        try {
            const { roomId, msg, userId, idWhereToSend } = req.body;
            const result = await message.Create({ roomId, msg, userId, idWhereToSend });
            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({msg: error.message});
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