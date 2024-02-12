const { insertIntoUserTable } = require("../Database");
let registerUsers = async (body) => {
  let registerPhone = body.registerPhone,
    registerPassword = body.registerPassword,
    fullName = body.fullName;
  let results = await insertIntoUserTable(
    fullName,
    registerPhone,
    registerPassword
  );
  return results;
  // //console.log("results is " + results);
};
module.exports = { registerUsers };
