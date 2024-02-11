const loginService = require("../Services/login.service");

let login = async (req, res) => {
  try {
    const { phoneNumber, Password } = req.body;
    // console.log("phoneNumber", phoneNumber, " req.body", req.body);
    const result = await loginService.login(phoneNumber, Password);
    // console.log("result", result);
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
module.exports = { login, verifyLoginController };
