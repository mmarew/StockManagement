const express = require("express");
const Router = express.Router();
const {
  login,
  verifyLoginController,
} = require("../Controllers/login.controllers");
const { authMiddleware } = require("../middleware/Auth");
Router.post("/Login/", login);
Router.post("/Login/verifyLogin/", authMiddleware, verifyLoginController);

Router.get("/requestPasswordReset/", (req, res) => {
  let select = `SELECT * FROM usersTable WHERE passwordStatus = 'requestedToReset'`;
  pool
    .query(select)
    .then(([rows]) => {
      let result = rows;
      if (rows.length > 0) {
        let userId = rows[0].userId;
        let update = `UPDATE usersTable SET passwordStatus = 'pinSentedToUser' WHERE userId = ?`;

        pool
          .query(update, [userId])
          .then(([rows]) => {
            let phoneNumber = result[0].phoneNumber;
            let pinCode = result[0].passwordResetPin;
            res.json({ phoneNumber, pinCode });
          })
          .catch((err) => {
            //console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        res.json({ phoneNumber: "notFound", pinCode: "notFound" });
      }
    })
    .catch((err) => {
      //console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
Router.post("/verifyPin", (req, res) => {
  let phone = req.body.PhoneNumber;
  let pincode = req.body.pincode;
  let select = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
  pool
    .query(select, [phone])
    .then(([rows]) => {
      if (rows.length > 0) {
        let pin = rows[0].passwordResetPin;
        if (pincode == pin) {
          res.json({ data: "correctPin" });
        } else {
          res.json({ data: "wrongPin" });
        }
      } else {
        res.status(404).json({ error: "Phone number not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
Router.post("/forgetRequest", (req, res) => {
  let phoneNumber = req.body.PhoneNumber;
  let sql = `SELECT * FROM usersTable WHERE phoneNumber = ?`;

  pool
    .query(sql, [phoneNumber])
    .then(([rows]) => {
      if (rows.length > 0) {
        let Rand = Math.floor(Math.random() * 1000000);
        let updateForgetPassStatus = `UPDATE usersTable SET passwordStatus = 'requestedToReset', passwordResetPin = ? WHERE phoneNumber = ?`;

        pool
          .query(updateForgetPassStatus, [Rand, phoneNumber])
          .then(() => {
            res.status(200).json({ data: "requestedToChangePassword" });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        console.log("error", "Phone number not found");
        return res.status(404).json({ error: "Phone number not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
Router.post("/updateChangeInpassword/", async (req, res) => {
  try {
    let phoneNumber = req.body.PhoneNumber;
    let password = req.body.Password.password;
    let retypedPassword = req.body.Password.retypedPassword;

    if (password !== retypedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, salt);
    let update = `UPDATE usersTable SET password = ? WHERE phoneNumber = ?`;
    let [result] = await pool.query(update, [encryptedPassword, phoneNumber]);

    if (result.affectedRows > 0) {
      res.status(200).json({ data: "passwordChanged" });
    } else {
      res.status(404).json({ data: "unableToMakeChange" });
    }
  } catch (error) {
    console.log("error");
  }
});

module.exports = Router;
