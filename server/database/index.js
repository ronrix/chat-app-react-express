module.exports = {
    databaseConnection: require('./connection'),
    userSchema: require('./schemas/user.schema'),
    messageSchema: require('./schemas/messages.schema'),
    notificationSchema: require('./schemas/notification.schema'),
}