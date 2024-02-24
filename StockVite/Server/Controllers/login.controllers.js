const loginService = require("../Services/login.service");

let login = async (req, res) => {
  try {
    const { phoneNumber, Password } = req.body;
    // console.log("phoneNumber", phoneNumber, " req.body", req.body);
    const result = await loginService.login(phoneNumber, Password);
    console.log("result", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

let verifyLoginController = async (req, res) => {
  let result = await loginService.verifyLogin(req.body);
  res.json(result);
};
let requestPasswordReset = async (req, res) => {
  let result = await loginService.requestPasswordReset(req.body);
  res.json(result);
};
let verifyPin = async (req, res) => {
  let result = await loginService.verifyPin(req.body);
  res.json(result);
};
let forgetRequest = async (req, res) => {
  let result = await loginService.forgetRequest(req.body);
  res.json(result);
};
let updateChangeInpassword = async (req, res) => {
  let result = await loginService.updateChangeInpassword(req.body);
  res.json(result);
};
module.exports = {
  updateChangeInpassword,
  forgetRequest,
  login,
  verifyLoginController,
  requestPasswordReset,
  verifyPin,
};
