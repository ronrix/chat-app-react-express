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
// add file upload limits to 3, this is for composing a message sending images
const upload = multer({ storage, limits: { files: 3 } }); 

// exporting env variables to shorten name when importing
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URI,
  APP_SECRET: process.env.APP_SECRET,
  DEFAULT_AVATAR_PATH: 'uploads/default-avatar.jpg',
  UPLOAD: upload,
  BACKEND_URL: process.env.BACKEND_URL
};