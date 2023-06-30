const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { APP_SECRET } = require('../config');

// generate salt for password hashing
module.exports.GenerateSalt = async () => {
  try {
    return await bcrypt.genSalt(10);
  } catch(error) {
    console.log(error)
    throw new Error("Failed generating salt!");
  }
};

// generate jwt token
module.exports.GenerateSignature = async (payload) => {
    try {
       return await jwt.sign(payload, APP_SECRET, { expiresIn: '30min' });
    } catch (error) {
      console.log(error)
      throw new Error("Failed generating token!");
    }
}

// generate refresh token
module.exports.RefreshToken = async (payload) => {
  try {
       return await jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
    } catch (error) {
      console.log(error)
      throw new Error("Failed generating new token!");
    }
}

// this format data
// if data is empty it will throw error
module.exports.FormatData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// decoding jwt token to get id
module.exports.DecodeToken = async (token) => {
  try {
    return await jwt.verify(token, APP_SECRET);
  } catch (error) {
    console.log(error)
    throw new Error(`Failed decoding the token`);
  }
}

// validate the token
module.exports.ValidateToken = async (req, res, next) => {
  const token = req.cookies.session;
  if(!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, APP_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}