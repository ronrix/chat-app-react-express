require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  APP_SECRET: process.env.APP_SECRET,
};