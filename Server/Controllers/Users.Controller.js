const serviceData = require("../Services/Users.Service");

let RegisterUsersController = (req, res) => {
  let result = serviceData.registerUsers(req.body);
  res.json(result);
};

let getMyProfile = async (req, res) => {
  let results = await serviceData.getMyProfile(req.body);
  res.json(results);
};
let deleteUsers = async (req, res) => {
  let results = await serviceData.deleteUsers(req.body);
  res.json(results);
};
module.exports = { RegisterUsersController, getMyProfile, deleteUsers };
