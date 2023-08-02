let jwt = require("jsonwebtoken");
async function Auth(datas) {
  try {
    let token = jwt.verify(datas, "shhhhh");
    let userID = token.userID;
    return userID;
  } catch (error) {
    console.log(error);
  }
}
module.exports.Auth = Auth;
