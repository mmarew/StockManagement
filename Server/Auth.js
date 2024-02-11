require("dotenv").config();
const jwt = require("jsonwebtoken");
let Auth = (req, res, next) => {
  try {
    let token = jwt.verify(datas, process.env.tokenKey);
    let userID = token.userID;
    return userID;
  } catch (error) {
    console.log(error);
  }
  return next();
};
module.exports.Auth = Auth;
