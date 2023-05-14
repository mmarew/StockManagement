let jwt = require("jsonwebtoken");
async function Auth(datas) {
  let token = jwt.verify(datas, "shhhhh");
  let userID = token.userID;
  return userID;
}
module.exports.Auth = Auth;
