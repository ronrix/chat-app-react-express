module.exports = {
    databaseConnection: require('./connection'),
    ContactSchema: require('./schemas/contacts.schema'),
    UserSchema: require('./schemas/user.schema'),
    MessageSchema: require('./schemas/messages.schema'),
}