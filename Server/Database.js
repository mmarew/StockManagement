const mysql = require("mysql");
let bcript = require("bcryptjs");
const mysql2 = require("mysql2/promise");

// Create a MySQL connection pool
const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "store",
});

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "masetawoshacom_stock",
//   password: "DBcp123$%^",
//   database: "masetawoshacom_store",
// });
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "guzowaycom_guzowaycom",
//   password: "+oyTI,&_)Mq$",
//   database: "guzowaycom_stock",
//  });
// server side connection

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store",
});
connection.connect();
function createBasicTables() {
  let createTable = `create table if not exists dailyTransaction(dailySalesId int auto_increment, purchaseQty int, salesQty int,businessId int, ProductId int,brokenQty int, Description varchar(2000), registrationDate Date, primary key(dailySalesId) )`;
  connection.query(createTable, (error, results) => {
    if (error) {
      // console.log(error);
    } else {
      // console.log(results.data);
    }
  });
  let create = `create table if not exists employeeTable(employeeId int auto_increment, userIdInEmployee int,BusinessIDEmployee int, employerId int, primary key(employeeId))`;
  connection.query(create, (err, result) => {
    if (err) console.log(err);
    if (result) console.log(result);
  });
  let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), createdDate Date,ownerId int, status varchar(300), primary key(businessId))`;
  connection.query(creeateBusiness, (err, results) => {
    if (results) {
      if (err) console.log(err);
      // console.log("results in create Business");
      // console.log(results);
    }
  });
  let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), passwordStatus varchar(40), passwordResetPin int, password varchar(200),primary key(userId))`;
  connection.query(queryTocreate, function (error, results, fields) {
    if (error) throw error;
    // console.log("The solution is: ", results);
  });
}
let createBusiness = (businessName, ownerId, createdDate, res, source) => {
  let select = "SELECT * FROM Business WHERE businessName = ?";
  let insert =
    "INSERT INTO Business (businessName, ownerId, createdDate) VALUES (?, ?, ?)";
  let tableExpenses =
    "CREATE TABLE IF NOT EXISTS ?? (expenseId INT(11) NOT NULL AUTO_INCREMENT, costId INT(11) NOT NULL, costAmount INT(11) NOT NULL, costDescription VARCHAR(9000) NOT NULL, costRegisteredDate DATE NOT NULL, PRIMARY KEY (expenseId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";
  let costTable =
    "CREATE TABLE IF NOT EXISTS ?? (costsId INT(11) NOT NULL AUTO_INCREMENT, costName VARCHAR(3000) NOT NULL, unitCost INT(11) NOT NULL, PRIMARY KEY (costsId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";
  let create =
    "CREATE TABLE IF NOT EXISTS ??(ProductId INT(11) NOT NULL AUTO_INCREMENT, productsUnitCost INT(11) NOT NULL, productsUnitPrice INT(11) NOT NULL, productName VARCHAR(900) NOT NULL, minimumQty INT(11) NOT NULL, PRIMARY KEY (ProductId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";
  let createTransaction =
    "CREATE TABLE IF NOT EXISTS ?? (transactionId INT(11) NOT NULL AUTO_INCREMENT, unitCost INT(11) NOT NULL, unitPrice INT(11) NOT NULL, productIDTransaction INT(11) NOT NULL, salesQty INT(11) NOT NULL, purchaseQty INT(11) NOT NULL, wrickages INT(11) NOT NULL, Inventory INT(11) NOT NULL, description VARCHAR(5000) NOT NULL, registeredTime DATE NOT NULL, PRIMARY KEY (transactionId)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";
  let queries = [];
  pool
    .query(select, [businessName])
    .then(([rows]) => {
      let tableCollections = {};
      if (rows.length == 0) {
        return pool.query(insert, [businessName, ownerId, createdDate]);
      } else {
        tableCollections.registerBusinessName = "registeredBefore";
        return Promise.resolve();
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
      let tableCollections = {};
      results.forEach((result, index) => {
        tableCollections[queries[index]] = result.rowCount;
      });
      res.json({ data: "created well", source, tableCollections });
    })
    .catch((err) => {
      console.error(err);
      res.json({ error: "Unable to create tables." });
    });
};
let insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
  // console.log(fullName,phoneNumber, password);
  //password encryption
  const salt = bcript.genSaltSync();
  //changing the value of password from req.body with the encrypted password
  const Encripted = bcript.hashSync(password, salt);
  let check = `select * from usersTable where phoneNumber=${phoneNumber}`;
  connection.query(check, (err, results) => {
    if (err) {
      return res.json({ err });
    } else {
      console.log(results);
      if (results.length > 0) {
        res.json({ data: "This phone number is registered before." });
      } else {
        let insertIntoUsers = `insert into usersTable (employeeName,phoneNumber,password) values(${fullName},${phoneNumber},'${Encripted}')`;
        connection.query(insertIntoUsers, (err, result) => {
          if (err) return res.json({ err });
          else if (result) {
            console.log("first Data is inserted well");
            res.json({ data: "Data is inserted well." });
          }
        });
      }
    }
  });
};
let deleteBusiness = (businessId, businessName, res) => {
  console.log("businessId in deleteBusiness", businessId);
  let sql = `delete from Business where BusinessID='${businessId}'`;
  let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
  let tableLength = tables.length,
    i = 0;
  let deleteEachTable = () => {
    let drop = `DROP TABLE ${businessName + tables[i]}`;
    connection.query(drop, (err, results) => {
      if (err) console.log(err);
      else console.log(results);
      if (i == tableLength - 1) {
        let responces = connection.query(sql, (err, result) => {
          if (err) return res.json({ data: err });
          if (result) {
            console.log("result of deleted data is ", result);
            return res.json({ data: result });
          }
        });
        return responces;
      } else if (i <= tableLength - 1) {
        i++;
        deleteEachTable();
      } else {
      }
    });
  };
  deleteEachTable();
};
module.exports.Pool = pool;
module.exports.mysql2 = mysql2;
module.exports.deleteBusiness = deleteBusiness;
module.exports.insertIntoUserTable = insertIntoUserTable;
module.exports.createBusiness = createBusiness;
module.exports.connection = connection;
module.exports.createBasicTables = createBasicTables;
// console.log("module.exports", module.exports);
