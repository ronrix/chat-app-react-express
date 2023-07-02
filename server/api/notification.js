const { NotificationService } = require("../services");
const { ValidateToken } = require("../utils");

module.exports = (app) => {
    const notification = new NotificationService();

    // Get notifications
    app.get('/notifications', [ValidateToken] , async (req, res) => {
        try {
            const { _id } = req.user; // get he room id from the query
            const notifications = await notification.GetAllNotifications(_id);
            return res.status(200).json(notifications);
        } catch (error) {
            return res.status(400).json({msg: error.message});
        }
    });
}