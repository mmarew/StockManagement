let bcript = require("bcryptjs");
const mysql2 = require("mysql2/promise");
const JWT = require("jsonwebtoken");

require("dotenv").config();
try {
  pool = mysql2.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectTimeout: 30000, // 30 seconds
  });
} catch (error) {
  //console.log("connection to data base error", error);
}
pool.getConnection();
let createBasicTables = () => {
  let createTableDailyTransaction = `create table if not exists dailyTransaction(dailySalesId int auto_increment, purchaseQty int not null default 0 , salesQty int not null default 0 , creditsalesQty int not null default 0 , salesTypeValues enum('On cash','By bank','On credit','Credit paied'),creditPaymentDate date , businessId int, ProductId int,brokenQty int, Description varchar(2000), registrationDate Date,itemDetailInfo varchar(9000), primary key(dailySalesId))`;
  pool
    .query(createTableDailyTransaction)
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      //console.log(error);
    });

  let create = `create table if not exists employeeTable(employeeId int auto_increment, userIdInEmployee int,BusinessIDEmployee int, employerId int, primary key(employeeId))`;
  pool
    .query(create)
    .then(() => {})
    .catch(() => {});
  let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), createdDate Date,ownerId int, status varchar(300), primary key(businessId))`;
  pool.query(creeateBusiness).then().catch();
  let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), passwordStatus varchar(40), passwordResetPin int, password varchar(200),primary key(userId))`;
  pool
    .query(queryTocreate)
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      //console.log(error);
    });
};
let createBusiness = (businessName, ownerId, createdDate, res, source) => {
  let select = "SELECT * FROM Business WHERE businessName = ?";
  let insert =
    "INSERT INTO Business (businessName, ownerId, createdDate) VALUES (?, ?, ?)";
  let tableExpenses =
    "CREATE TABLE IF NOT EXISTS ?? (expenseId INT(11) NOT NULL AUTO_INCREMENT, costId INT(11) NOT NULL, costAmount INT(11) NOT NULL, costDescription VARCHAR(9000) NOT NULL, costRegisteredDate DATE NOT NULL, PRIMARY KEY (expenseId)) ";
  let costTable =
    "CREATE TABLE IF NOT EXISTS ?? (costsId INT(11) NOT NULL AUTO_INCREMENT, costName VARCHAR(3000) NOT NULL, unitCost INT(11) NOT NULL, PRIMARY KEY (costsId)) ";
  let createProductsTable =
    "CREATE TABLE IF NOT EXISTS ??(ProductId INT(11) NOT NULL AUTO_INCREMENT, previousProductId int, productsUnitCost INT(11) NOT NULL, prevUnitCost int, productsUnitPrice INT(11) NOT NULL, prevUnitPrice int, productName VARCHAR(900) NOT NULL, prevProductName varchar(1000), minimumQty INT(11) NOT NULL, prevMinimumQty int, Status enum('active','changed','replaced','active_but_updated') PRIMARY KEY (ProductId)) ";
  let createTransaction =
    "CREATE TABLE IF NOT EXISTS ?? (transactionId INT(11) NOT NULL AUTO_INCREMENT, unitCost INT(11) NOT NULL, unitPrice INT(11) NOT NULL, productIDTransaction INT(11) NOT NULL, salesQty INT(11) NOT NULL default 0, creditsalesQty int(11) NOT NULL  default 0,  purchaseQty INT(11) NOT NULL default 0, wrickages INT(11) NOT NULL default 0, Inventory INT(11) NOT NULL default 0, description VARCHAR(5000) NOT NULL, registeredTime DATE NOT NULL, creditDueDate date ,salesTypeValues enum('On cash','By bank','On credit','Credit paied'),creditPayementdate date , PRIMARY KEY (transactionId)) ";

  let queries = [],
    tableCollections = {};
  pool
    .query(select, [businessName])
    .then(async ([rows]) => {
      if (rows.length == 0) {
        return pool
          .query(insert, [businessName, ownerId, createdDate])
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        tableCollections.registerBusinessName = "registeredBefore";
        throw "registeredBefore";
      }
    })
    .then((data) => {
      let tables = ["_expenses", "_Costs", "_products", "_Transaction"];
      queries = [
        tableExpenses,
        costTable,
        createProductsTable,
        createTransaction,
      ];
      let promises = queries.map(async (query, index) => {
        return await pool
          .query(query, [businessName + tables[index]])
          .then(([data]) => {
            // console.log(
            //   "In creating table " + businessName + tables[index] + " ",
            //   data
            // );
            return data; // Return the query result
          })
          .catch((error) => {
            console.log(error);
            throw error; // Rethrow the error to be caught later
          });
      });
      // console.log("Promise", Promise);
      return Promise.all(promises);
    })
    .then((results) => {
      if (results) {
        results.forEach((result, index) => {
          console.log("result", result.rowCount);
          tableCollections[queries[index]] = result.rowCount;
        });
      }
      res.json({ data: "created well", source, tableCollections });
    })
    .catch((error) => {
      console.error("errors on table creating systems", error);
      if (error === "registeredBefore") return res.json({ error });
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
      //console.log(rows);
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

            //console.log("Data is inserted successfully");
            res.json({ data: "Data is inserted successfully.", token });
          })
          .catch((error) => {
            //console.error(error);
            res.json({ error: "An error occurred while inserting data." });
          });
      }
    })
    .catch((error) => {
      //console.error(error);
      res.json({ error: "An error occurred while checking phone number." });
    });
};
const deleteBusiness = (businessId, businessName, res) => {
  //console.log(
  //   "businessId in deleteBusiness",
  //   businessId,
  //   "businessName",
  //   businessName
  // );
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
        //console.log("dropvalues =", dropvalues, " i is", i);
        if (i === tableLength - 1) {
          pool
            .query(sql, sqlValues)
            .then((result) => {
              //console.log("result of deleted data is ", result);
              return res.json({ data: result[0] });
            })
            .catch((error) => {
              //console.error(error);
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
        //console.error(error);
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
