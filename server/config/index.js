require("dotenv").config();

// exporting env variables to shorten name when importing
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  APP_SECRET: process.env.APP_SECRET,
};