const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
    mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    })
    .catch((err) => {
        console.error('Error connecting to Mongo', err);
    });
}