import jwt from "jsonwebtoken";
async function Auth(datas) {
  let token = jwt.verify(datas, "shhhhh");
  let userID = token.userID;
  return userID;
}
export default Auth;
