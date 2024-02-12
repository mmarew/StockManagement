const { registerUsers } = require("../Services/Users.Service");

let RegisterUsersController = (req, res) => {
  let result = registerUsers(req.body);
  res.json(result);
};
module.exports = { RegisterUsersController };
