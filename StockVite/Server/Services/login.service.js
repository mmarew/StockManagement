const { pool } = require("../Config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = process.env.tokenKey;
let login = async (phoneNumber, password) => {
  try {
    // let phoneNumber = body.phoneNumber;
    let select = `SELECT * FROM usersTable WHERE phoneNumber = ? LIMIT 1`;
    let [rows] = await pool.query(select, [phoneNumber]);
    if (rows.length == 0) {
      return "Not Registered Phone Number";
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
const requestPasswordReset = async (body) => {
  try {
    const select = `SELECT * FROM usersTable WHERE passwordStatus = 'requestedToReset'`;
    const [rows] = await pool.query(select);

    if (rows.length > 0) {
      const userId = rows[0].userId;
      const update = `UPDATE usersTable SET passwordStatus = 'pinSentedToUser' WHERE userId = ?`;
      await pool.query(update, [userId]);

      const phoneNumber = rows[0].phoneNumber;
      const pinCode = rows[0].passwordResetPin;
      return { phoneNumber, pinCode };
    } else {
      return { phoneNumber: "notFound", pinCode: "notFound" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
};
const verifyPin = async (body) => {
  try {
    const phone = body.PhoneNumber;
    const pincode = body.pincode;
    const select = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
    const [rows] = await pool.query(select, [phone]);

    if (rows.length > 0) {
      const pin = rows[0].passwordResetPin;
      if (pincode == pin) {
        return { data: "correctPin" };
      } else {
        return { data: "wrongPin" };
      }
    } else {
      return { error: "Phone number not found" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
};
const forgetRequest = async (body) => {
  try {
    const phoneNumber = body.PhoneNumber;
    const sql = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
    const [rows] = await pool.query(sql, [phoneNumber]);

    if (rows.length > 0) {
      const rand = Math.floor(Math.random() * 1000000);
      const updateForgetPassStatus = `UPDATE usersTable SET passwordStatus = 'requestedToReset', passwordResetPin = ? WHERE phoneNumber = ?`;

      await pool.query(updateForgetPassStatus, [rand, phoneNumber]);
      return { data: "requestedToChangePassword" };
    } else {
      console.log("Phone number not found");
      return { error: "Phone number not found" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
};
const updateChangeInpassword = async (body) => {
  try {
    let phoneNumber = body.PhoneNumber;
    let password = body.Password.password;
    let retypedPassword = body.Password.retypedPassword;

    if (password !== retypedPassword) {
      return { error: "Passwords do not match" };
    }
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, salt);
    let update = `UPDATE usersTable SET password = ? WHERE phoneNumber = ?`;
    let [result] = await pool.query(update, [encryptedPassword, phoneNumber]);

    if (result.affectedRows > 0) {
      return { data: "passwordChanged" };
    } else {
      return { data: "unableToMakeChange" };
    }
  } catch (error) {
    console.log("error");
  }
};

module.exports = {
  updateChangeInpassword,
  login,
  verifyLogin,
  requestPasswordReset,
  verifyPin,
  forgetRequest,
};
