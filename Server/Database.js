// const mysql = require("mysql");
let bcript = require("bcryptjs");
const mysql2 = require("mysql2/promise");
const JWT = require("jsonwebtoken");
// Create a MySQL pool pool
const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "store",
});

// const pool = mysql2.createPool({
//   host: "localhost",
//   user: "masetawoshacom_stock",
//   password: "DBcp123$%^",
//   database: "masetawoshacom_store",
// });
// var pool = mysql2.createpool({
//   host: "localhost",
//   user: "guzowaycom_guzowaycom",
//   password: "+oyTI,&_)Mq$",
//   database: "guzowaycom_stock",
// });
// server side pool

// let pool = mysql.createpool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "store",
// });
// pool.connect();
// function createBasicTables() {
//   let createTable = `create table if not exists dailyTransaction(dailySalesId int auto_increment, purchaseQty int, salesQty int,businessId int, ProductId int,brokenQty int, Description varchar(2000), registrationDate Date, primary key(dailySalesId) )`;
//   pool.query(createTable, (error, results) => {
//     if (error) {
//       // console.log(error);
//     } else {
//       // console.log(results.data);
//     }
//   });
//   let create = `create table if not exists employeeTable(employeeId int auto_increment, userIdInEmployee int,BusinessIDEmployee int, employerId int, primary key(employeeId))`;
//   pool.query(create, (err, result) => {
//     if (err) console.log(err);
//     if (result) console.log(result);
//   });
//   let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), createdDate Date,ownerId int, status varchar(300), primary key(businessId))`;
//   pool.query(creeateBusiness, (err, results) => {
//     if (results) {
//       if (err) console.log(err);
//       // console.log("results in create Business");
//       // console.log(results);
//     }
//   });
//   let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), passwordStatus varchar(40), passwordResetPin int, password varchar(200),primary key(userId))`;
//   pool.query(queryTocreate, function (error, results, fields) {
//     if (error) throw error;
//     // console.log("The solution is: ", results);
//   });
// }
function createBasicTables() {
  let createTable = `CREATE TABLE IF NOT EXISTS dailyTransaction (
    dailySalesId INT AUTO_INCREMENT,
    purchaseQty INT,
    salesQty INT,
    businessId INT,
    ProductId INT,
    brokenQty INT,
    Description VARCHAR(2000),
    registrationDate DATE,
    PRIMARY KEY (dailySalesId)
  )`;

  let createEmployeeTable = `CREATE TABLE IF NOT EXISTS employeeTable (
    employeeId INT AUTO_INCREMENT,
    userIdInEmployee INT,
    BusinessIDEmployee INT,
    employerId INT,
    PRIMARY KEY (employeeId)
  )`;

  let createBusinessTable = `CREATE TABLE IF NOT EXISTS Business (
    BusinessID INT AUTO_INCREMENT,
    BusinessName VARCHAR(500),
    createdDate DATE,
    ownerId INT,
    status VARCHAR(300),
    PRIMARY KEY (BusinessID)
  )`;

  let createUsersTable = `CREATE TABLE IF NOT EXISTS usersTable (
    userId INT AUTO_INCREMENT,
    phoneNumber VARCHAR(200),
    employeeName VARCHAR(600),
    passwordStatus VARCHAR(40),
    passwordResetPin INT,
    password VARCHAR(200),
    PRIMARY KEY (userId)
  )`;

  pool
    .query(createTable)
    .then((result) => {
      console.log("dailyTransaction table created");
    })
    .catch((error) => {
      console.error(error);
    });

  pool
    .query(createEmployeeTable)
    .then((result) => {
      console.log("employeeTable created");
    })
    .catch((error) => {
      console.error(error);
    });

  pool
    .query(createBusinessTable)
    .then((result) => {
      console.log("Business table created");
    })
    .catch((error) => {
      console.error(error);
    });

  pool
    .query(createUsersTable)
    .then((result) => {
      console.log("usersTable created");
    })
    .catch((error) => {
      console.error(error);
    });
}
let createBusiness = (businessName, ownerId, createdDate, res, source) => {
  let select = "SELECT * FROM Business WHERE businessName = ?";
  let insert =
    "INSERT INTO Business (businessName, ownerId, createdDate) VALUES (?, ?, ?)";
  let tableExpenses =
    "CREATE TABLE IF NOT EXISTS ?? (expenseId INT(11) NOT NULL AUTO_INCREMENT, costId INT(11) NOT NULL, costAmount INT(11) NOT NULL, costDescription VARCHAR(9000) NOT NULL, costRegisteredDate DATE NOT NULL, PRIMARY KEY (expenseId)) ";
  let costTable =
    "CREATE TABLE IF NOT EXISTS ?? (costsId INT(11) NOT NULL AUTO_INCREMENT, costName VARCHAR(3000) NOT NULL, unitCost INT(11) NOT NULL, PRIMARY KEY (costsId)) ";
  let create =
    "CREATE TABLE IF NOT EXISTS ??(ProductId INT(11) NOT NULL AUTO_INCREMENT, productsUnitCost INT(11) NOT NULL, productsUnitPrice INT(11) NOT NULL, productName VARCHAR(900) NOT NULL, minimumQty INT(11) NOT NULL, PRIMARY KEY (ProductId)) ";
  let createTransaction =
    "CREATE TABLE IF NOT EXISTS ?? (transactionId INT(11) NOT NULL AUTO_INCREMENT, unitCost INT(11) NOT NULL, unitPrice INT(11) NOT NULL, productIDTransaction INT(11) NOT NULL, salesQty INT(11) NOT NULL, purchaseQty INT(11) NOT NULL, wrickages INT(11) NOT NULL, Inventory INT(11) NOT NULL, description VARCHAR(5000) NOT NULL, registeredTime DATE NOT NULL, PRIMARY KEY (transactionId)) ";
  let queries = [],
    tableCollections = {};
  pool
    .query(select, [businessName])
    .then(([rows]) => {
      console.log("rows in create table", rows);
      // return;
      if (rows.length == 0) {
        return pool.query(insert, [businessName, ownerId, createdDate]);
      } else {
        tableCollections.registerBusinessName = "registeredBefore";
        throw "registeredBefore";
      }
    })
    .then(() => {
      let tables = ["_expenses", "_Costs", "_products", "_Transaction"];
      queries = [tableExpenses, costTable, create, createTransaction];
      let promises = queries.map((query, index) => {
        return pool.query(query, [businessName + tables[index]]);
      });

      return Promise.all(promises);
    })
    .then((results) => {
      results.forEach((result, index) => {
        tableCollections[queries[index]] = result.rowCount;
      });
      res.json({ data: "created well", source, tableCollections });
    })
    .catch((error) => {
      console.error("errors on table creating systems", error);
      if (error == "registeredBefore") return res.json({ error });
      res.json({ error: "Unable to create tables." });
    });
};
const insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
  const salt = bcript.genSaltSync();
  const encryptedPassword = bcript.hashSync(password, salt);

  let check = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
  pool
    .query(check, [phoneNumber])
    .then(([rows]) => {
      console.log(rows);
      if (rows.length > 0) {
        let token = JWT.sign({ userID: rows[0].userId }, "shhhhh");
        res.json({ data: "This phone number is registered before.", token });
      } else {
        let insertIntoUsers = `INSERT INTO usersTable (employeeName, phoneNumber, password) VALUES (?, ?, ?)`;
        pool
          .query(insertIntoUsers, [fullName, phoneNumber, encryptedPassword])
          .then((result) => {
            const insertedId = result.insertId; // Get the ID of the inserted row
            let token = JWT.sign({ userID: insertedId }, "shhhhh");

            console.log("Data is inserted successfully");
            res.json({ data: "Data is inserted successfully.", token });
          })
          .catch((error) => {
            console.error(error);
            res.json({ error: "An error occurred while inserting data." });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.json({ error: "An error occurred while checking phone number." });
    });
};
// let insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
//   // console.log(fullName,phoneNumber, password);
//   //password encryption
//   const salt = bcript.genSaltSync();
//   //changing the value of password from req.body with the encrypted password
//   const Encripted = bcript.hashSync(password, salt);
//   let check = `select * from usersTable where phoneNumber=${phoneNumber}`;
//   pool.query(check, (err, results) => {
//     if (err) {
//       return res.json({ err });
//     } else {
//       console.log(results);
//       if (results.length > 0) {
//         res.json({ data: "This phone number is registered before." });
//       } else {
//         let insertIntoUsers = `insert into usersTable (employeeName,phoneNumber,password) values(${fullName},${phoneNumber},'${Encripted}')`;
//         pool.query(insertIntoUsers, (err, result) => {
//           if (err) return res.json({ err });
//           else if (result) {
//             console.log("first Data is inserted well");
//             res.json({ data: "Data is inserted well." });
//           }
//         });
//       }
//     }
//   });
// };
// let deleteBusiness = (businessId, businessName, res) => {
//   console.log("businessId in deleteBusiness", businessId);
//   let sql = `delete from Business where BusinessID='${businessId}'`;
//   let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
//   let tableLength = tables.length,
//     i = 0;
//   let deleteEachTable = () => {
//     let drop = `DROP TABLE ${businessName + tables[i]}`;
//     pool.query(drop, (err, results) => {
//       if (err) console.log(err);
//       else console.log(results);
//       if (i == tableLength - 1) {
//         let responces = pool.query(sql, (err, result) => {
//           if (err) return res.json({ data: err });
//           if (result) {
//             console.log("result of deleted data is ", result);
//             return res.json({ data: result });
//           }
//         });
//         return responces;
//       } else if (i <= tableLength - 1) {
//         i++;
//         deleteEachTable();
//       } else {
//       }
//     });
//   };
//   deleteEachTable();
// };
const deleteBusiness = (businessId, businessName, res) => {
  console.log(
    "businessId in deleteBusiness",
    businessId,
    "businessName",
    businessName
  );
  // return;
  let sql = `DELETE FROM Business WHERE BusinessID=?`;
  let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
  let tableLength = tables.length,
    i = 0;
  let sqlValues = [businessId];

  let deleteEachTable = () => {
    let drop = `DROP TABLE IF EXISTS ??`;
    dropvalues = [businessName + tables[i]];
    pool
      .query(drop, dropvalues)
      .then((results) => {
        console.log("dropvalues =", dropvalues, " i is", i);
        if (i === tableLength - 1) {
          pool
            .query(sql, sqlValues)
            .then((result) => {
              console.log("result of deleted data is ", result);
              return res.json({ data: result[0] });
            })
            .catch((error) => {
              console.error(error);
              return res.json({
                message: error,
                error: "An error occurred while deleting business data.",
              });
            });
        } else if (i <= tableLength - 1) {
          i++;
          deleteEachTable();
        }
      })
      .catch((error) => {
        console.error(error);
        return res.json({
          error: `An error occurred while dropping ${
            businessName + tables[i]
          } table.`,
        });
      });
  };

  deleteEachTable();
};
module.exports.Pool = pool;
module.exports.mysql2 = mysql2;
module.exports.deleteBusiness = deleteBusiness;
module.exports.insertIntoUserTable = insertIntoUserTable;
module.exports.createBusiness = createBusiness;
module.exports.pool = pool;
module.exports.createBasicTables = createBasicTables;
// console.log("module.exports", module.exports);
