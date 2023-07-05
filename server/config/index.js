require("dotenv").config();

// file upload with multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage });

// exporting env variables to shorten name when importing
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  APP_SECRET: process.env.APP_SECRET,
  DEFAULT_AVATAR_PATH: 'uploads/default-avatar.jpg',
  UPLOAD: upload
};