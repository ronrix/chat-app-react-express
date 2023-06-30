module.exports = {
    databaseConnection: require('./connection'),
    UserSchema: require('./schemas/user.schema'),
    MessageSchema: require('./schemas/messages.schema'),
    NotificationSchema: require('./schemas/notification.schema'),
}