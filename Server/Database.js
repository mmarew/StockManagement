let bcript = require("bcryptjs");
const mysql2 = require("mysql2/promise");
const JWT = require("jsonwebtoken");
let tokenKey = "shhhhh";
let bcrypt = require("bcryptjs");
const { json } = require("express");
require("dotenv").config();
try {
  pool = mysql2.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectTimeout: 300000, // 30 seconds
  });
} catch (error) {
  //console.log("connection to data base error", error);
}
pool.getConnection();
let createBasicTables = async () => {
  try {
    let createCreditCollection = `CREATE TABLE IF NOT EXISTS creditCollection (
    collectionId INT NOT NULL auto_increment,
    collectionDate DATE,
    userId int,
    collectionAmount int,
    registrationSource enum('total','Single'),
    businessId INT,
    targtedProductId INT,
    transactionId INT,
    PRIMARY KEY (collectionId)
)`;

    let [responses] = await pool.query(createCreditCollection);

    let createTableDailyTransaction = `create table if not exists dailyTransaction(dailySalesId int auto_increment, purchaseQty int not null default 0, salesQty int not null default 0 , creditsalesQty int not null default 0, salesTypeValues enum('On cash','By bank','On credit','Credit paied','Partially paied'),creditPaymentDate date, partiallyPaidInfo JSON, businessId int, ProductId int,brokenQty int, Description varchar(2000), registeredTimeDaily Date,itemDetailInfo varchar(9000), reportStatus ENUM('unreported to total sales', 'reported to total sales'), primary key(dailySalesId))`;
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

    let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), uniqueBusinessName varchar(900) not null, createdDate Date,ownerId int, status varchar(300), primary key(businessId))`;

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
  } catch (error) {
    console.log(error);
  }
};
let createBusiness = async (
  businessName,
  ownerId,
  createdDate,
  res,
  source
) => {
  let uniqueBusinessName = businessName.replace(/[^A-Za-z0-9_]/g, "");

  let select = `SELECT * FROM Business WHERE uniqueBusinessName = ?`;
  let insert = `INSERT INTO Business (businessName,uniqueBusinessName, ownerId, createdDate) VALUES (?,?,?,?)`;
  let tableExpenses =
    "CREATE TABLE IF NOT EXISTS ?? (expenseId INT(11) NOT NULL AUTO_INCREMENT, costId INT(11) NOT NULL, costAmount INT(11) NOT NULL, costDescription VARCHAR(9000) NOT NULL, costRegisteredDate DATE NOT NULL, PRIMARY KEY (expenseId)) ";
  let costTable =
    "CREATE TABLE IF NOT EXISTS ?? (costsId INT(11) NOT NULL AUTO_INCREMENT, costName VARCHAR(3000) NOT NULL, unitCost INT(11) NOT NULL, PRIMARY KEY (costsId)) ";
  let createProductsTable =
    "CREATE TABLE IF NOT EXISTS ??(ProductId INT(11) NOT NULL AUTO_INCREMENT, productRegistrationDate date, mainProductId int, productsUnitCost INT(11) NOT NULL, prevUnitCost int, productsUnitPrice INT(11) NOT NULL, prevUnitPrice int, productName VARCHAR(900) NOT NULL, prevProductName varchar(1000), minimumQty INT(11) NOT NULL, prevMinimumQty int, Status enum('active','changed','replaced','active_but_updated'), PRIMARY KEY (ProductId)) ";
  let createTransaction =
    "CREATE TABLE IF NOT EXISTS ?? (transactionId INT(11) NOT NULL AUTO_INCREMENT, unitCost INT(11) NOT NULL, unitPrice INT(11) NOT NULL, productIDTransaction INT(11) NOT NULL, mainProductId int, salesQty INT(11) NOT NULL default 0, creditsalesQty int(11) NOT NULL  default 0,  purchaseQty INT(11) NOT NULL default 0, wrickages INT(11) NOT NULL default 0, Inventory INT(11) NOT NULL default 0, description VARCHAR(5000) NOT NULL, registeredTime DATE NOT NULL, creditDueDate date ,salesTypeValues enum('On cash','By bank','On credit','Credit paied','Partially paied'),registrationSource enum('Total','Single'), partiallyPaidInfo JSON, creditPayementdate date, PRIMARY KEY (transactionId)) ";

  let queries = [],
    tableCollections = {};
  let newBusinessName = uniqueBusinessName;

  let registerMainBusinessName = async (nameOfBusiness) => {
    try {
      nameOfBusiness = nameOfBusiness.replace(/[^A-Za-z0-9_]/g, "");
      const [rows] = await pool.query(select, [nameOfBusiness]);
      if (rows.length == 0) {
        const data = await pool.query(insert, [
          businessName,
          nameOfBusiness,
          ownerId,
          createdDate,
        ]);
        return "Business Created";
      } else {
        let { BusinessID } = rows[0];
        newBusinessName = uniqueBusinessName + "_" + BusinessID;
        return await registerMainBusinessName(newBusinessName);
        // tableCollections.registerBusinessName = "registeredBefore";
        // throw "registeredBefore";
      }
    } catch (error) {
      console.log("error", error);
      return res.json({ data: "unable to register business name" });
    }
  };
  try {
    await registerMainBusinessName(newBusinessName);
    let tables = ["_expenses", "_Costs", "_products", "_Transaction"];
    queries = [
      tableExpenses,
      costTable,
      createProductsTable,
      createTransaction,
    ];
    let promises = queries.map(async (query, index) => {
      try {
        const [data] = await pool.query(query, [
          newBusinessName + tables[index],
        ]);
        console.log("data == ", data);
        console.log("query == ", query);
        return data; // Return the query result
      } catch (error) {
        console.log(error);
        throw error; // Rethrow the error to be caught later
      }
    });

    const results = await Promise.all(promises);
    if (results) {
      results.forEach((result, index) => {
        tableCollections[queries[index]] = result.rowCount;
      });
    }

    res.json({ data: "created well", source, tableCollections });
  } catch (error) {
    console.error("errors on table creating systems", error);
    if (error === "registeredBefore") return res.json({ error });
    res.json({ error: "Unable to create tables." });
  }
};
const insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
  const salt = bcript.genSaltSync();
  const encryptedPassword = bcript.hashSync(password, salt);

  let check = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
  pool
    .query(check, [phoneNumber])
    .then(([rows]) => {
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
const deleteBusiness = async (body, res) => {
  let { businessName, businessId, userPassword, token } = body;
  let { userID } = JWT.verify(token, tokenKey);
  let select = `SELECT * FROM usersTable WHERE userId = '${userID}' LIMIT 1`;
  [rows] = await pool.query(select);
  if (rows.length == 0) return res.json({ data: "user is not found." });

  let savedPassword = rows[0].password;
  const isMatch = bcrypt.compareSync(userPassword, savedPassword);
  if (!isMatch) return res.json({ data: "wrong password." });
  let sqlToGetBusiness = `select * from Business where BusinessID='${businessId}'`;
  let [businessRows] = await pool.query(sqlToGetBusiness);
  let { uniqueBusinessName } = businessRows[0];
  // return;
  let sql = `DELETE FROM Business WHERE BusinessID=?`;
  let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
  let tableLength = tables.length,
    i = 0;
  let sqlValues = [businessId];

  let deleteEachTable = () => {
    let drop = `DROP TABLE IF EXISTS ??`;
    dropvalues = [uniqueBusinessName + tables[i]];
    pool
      .query(drop, dropvalues)
      .then((results) => {
        if (i === tableLength - 1) {
          pool
            .query(sql, sqlValues)
            .then((result) => {
              return res.json({ data: result[0] });
            })
            .catch((error) => {
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
