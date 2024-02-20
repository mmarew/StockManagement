const { pool } = require("../Config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = process.env.tokenKey;
let login = async (phoneNumber, password) => {
  try {
    // let phoneNumber = req.body.phoneNumber;
    let select = `SELECT * FROM usersTable WHERE phoneNumber = ? LIMIT 1`;
    let [rows] = await pool.query(select, [phoneNumber]);
    // console.log("usersTable", rows);
    if (rows.length == 0) {
      return "wrong phone number.";
    }

    let savedPassword = rows[0].password;
    let { employeeName } = rows[0];
    const isMatch = bcrypt.compareSync(password, savedPassword);
    if (isMatch) {
      let token = jwt.sign(
        { userID: rows[0].userId, usersFullName: employeeName },
        tokenKey
      );
      return { Message: "login successfully.", token };
    } else {
      return { Message: "wrong password." };
    }
  } catch (error) {
    console.log("error", error);
    return { Message: "error in login service" };
  }
};
// server.post(path + "verifyLogin/",

const verifyLogin = async (body) => {
  try {
    const userID = body.userID;
    const selectQuery = `SELECT * FROM usersTable WHERE userId = ?`;

    const [rows] = await pool.query(selectQuery, [userID]);

    if (rows.length > 0) {
      return { data: "alreadyConnected", result: rows };
    } else {
      return { data: "dataNotFound" };
    }
  } catch (err) {
    console.error(err);
    return { error: "Internal Server Error" };
  }
};

module.exports = { login, verifyLogin };
