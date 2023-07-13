const GroupChatService = require("../services/group.service");
const { ValidateToken } = require("../utils");

module.exports = (app) => {
    const groupChatService = new GroupChatService();

    // create new group chat
    app.post('/create-group-chat', [ValidateToken], async(req, res) => {
        try {
            const { _id } = req.user; // get user id
            const { name, members, roomId  } = req.body;
            const { data } = await groupChatService.CreateGroupChat({ name, members, roomId, userId: _id });
            return res.json(data);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    });
}