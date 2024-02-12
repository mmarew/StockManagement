const { RegisterUsersController } = require("../Controllers/Users.Controller");

const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");

let Router = require("express").Router();
const path = "/";
Router.post(
  path + "deleteUsers/",
  authMiddleware,
  authMiddleware2,
  async (req, res) => {
    try {
      let userID = await Auth(req.body.storeToken);
      console.log("userID", userID);

      let SelectUser = `SELECT * FROM usersTable WHERE userId = ?`;
      let selectBusiness = `SELECT * FROM Business WHERE ownerId = ?`;
      let Drop = `DROP TABLE IF EXISTS ??, ??, ??, ??`;
      let deleteBusiness = `DELETE FROM Business where ownerId = '${userID}'`;
      let deleteUsers = `DELETE FROM usersTable WHERE userId ='${userID}'`;

      try {
        const [results] = await pool.query(SelectUser, [userID]);
        if (results) {
          let Password = req.body.Password;
          let savedPassword = results[0].password;
          console.log("savedPassword", savedPassword);
          console.log("Password", Password);
          const isMatch = bcrypt.compareSync(Password, savedPassword);
          console.log("isMatch", isMatch);

          if (!isMatch) {
            res.json({ data: "wrong password" });
            return;
          }

          if (results.length > 0) {
            const [result1] = await pool.query(selectBusiness, [userID]);
            console.log("result1", result1);

            if (result1.length > 0) {
              let BusinessName = result1[0].uniqueBusinessName;
              let tables = [
                `${BusinessName}_expenses`,
                `${BusinessName}_Costs`,
                `${BusinessName}_products`,
                `${BusinessName}_Transaction`,
              ];
              const [DeleteResults] = await pool.query(Drop, tables);
              console.log("DeleteResults", DeleteResults);
            } else {
              console.log("opopop");
            }

            try {
              const [deleteResult] = await pool.query(deleteBusiness);
              const [deleteUsersResult] = await pool.query(deleteUsers);
              console.log("deleteUsersResult", deleteUsersResult);
              console.log("deleteResult", deleteResult);
            } catch (error) {
              console.log("error on result2", error);
            }

            res.json({ data: "deleted data" });
          } else {
            res.json({ data: results });
          }
        }
      } catch (error) {
        console.error(error);
        res.json({ data: "err 5.908" });
      }
    } catch (error) {
      console.log("error", error);
    }
  }
);
Router.post(path + "RegisterUsers/", RegisterUsersController);
Router.post(path + "getMyProfile/", authMiddleware, async (req, res) => {
  let userId = await Auth(req.body.myToken);
  //console.log("userId", userId);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userId];
  pool
    .query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      res.json({ data: rows });
    })
    .catch((error) => {
      res.json({ data: "error No 5" });
      //console.error("An error occurred:", error);
    });
});
Router.post(path + "updateUsers", authMiddleware, async (req, res) => {
  // return res.json({ data: "it is ok" });
  let fullName = req.body.fullName,
    phoneNumber = req.body.phoneNumber,
    oldPassword = req.body.oldPassword,
    newPassword = req.body.newPassword,
    myToken = req.body.myToken;
  const salt = bcrypt.genSaltSync();
  //changing the value of password from req.body with the encrypted password
  const Encripted = bcrypt.hashSync(newPassword, salt);
  // //console.log("Encripted", Encripted);
  let userID = await Auth(myToken);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userID];

  pool
    .query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      // Do something else
      if (rows.length > 0) {
        let savedPassword = rows[0].password;
        const isMatch = bcrypt.compareSync(oldPassword, savedPassword);

        let Update = "";
        let query, values;

        if (newPassword === "noChangeOnPassword") {
          query = `
    UPDATE usersTable
    SET phoneNumber = ?,
        employeeName = ?
    WHERE userId = ?
  `;
          values = [phoneNumber, fullName, userID];
        } else {
          query = `
    UPDATE usersTable
    SET phoneNumber = ?,
        employeeName = ?,
        password = ?
    WHERE userId = ?
  `;
          values = [phoneNumber, fullName, Encripted, userID];
        }

        pool
          .query(query, values)
          .then(([result]) => {
            res.json({ data: "your data is updated" });
          })
          .catch((error) => {
            //console.error(error);
            res.json({ data: "error 06.1" });
          });
        // if (isMatch) {
        //   let Update = "";
        //   if (newPassword == "noChangeOnPassword") {
        //     Update = `update usersTable set phoneNumber='${phoneNumber}',employeeName='${fullName}' where userId='${userID}'`;
        //   } else {
        //     Update = `update usersTable set phoneNumber='${phoneNumber}',employeeName='${fullName}', password='${Encripted}' where userId='${userID}'`;
        //   }
        //   connection.query(Update, (err, result) => {
        //     if (err) {
        //       //console.log(err);
        //       return res.json({ data: "error 06.1" });
        //     } else {
        //       res.json({ data: "your data is updated" });
        //     }
        //   });
        // } else {
        //   res.json({ data: "wrong old password" });
        // }
      } else res.json({ data: "no data found" });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      // Handle the error
      res.json({ data: "error 06" });
    });
  return;
  let Select = `select * from usersTable where userId='${userID}'`;
  connection.query(Select, (err, results) => {
    if (err) {
      //console.log(err);
      return;
    }
    if (results) {
      if (results.length > 0) {
        let savedPassword = results[0].password;
        const isMatch = bcrypt.compareSync(oldPassword, savedPassword);
        if (isMatch) {
          let Update = `update usersTable set phoneNumber='${phoneNumber}',employeeName='${fullName}', password='${Encripted}' where userId='${userID}'`;
          if (newPassword == "noChangeOnPassword") {
            Update = `update usersTable set phoneNumber='${phoneNumber}',employeeName='${fullName}' where userId='${userID}'`;
          }
          connection.query(Update, (err, result) => {
            if (err) {
              //console.log(err);
              return res.json({ data: "error 06.1" });
            } else {
              res.json({ data: "your data is updated" });
            }
          });
        } else {
          res.json({ data: "wrong old password" });
        }
      } else res.json({ data: "no data found" });
    }
  });
});

module.exports = Router;
