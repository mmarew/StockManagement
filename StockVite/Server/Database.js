let bcript = require("bcryptjs");
const { pool, executeQuery } = require("./Config/db.config");
const JWT = require("jsonwebtoken");
require("dotenv").config();

try {
} catch (error) {}

let createBasicTables = async () => {
  try {
    let createCreditCollection = `CREATE TABLE IF NOT EXISTS creditCollection (
    collectionId INT NOT NULL auto_increment,
    collectionDate DATE,
    userId int,
    collectionAmount float,
    registrationSource enum('total','Single'),
    businessId INT,
    targtedProductId INT,
    transactionId INT,
    collectedBy varchar(3000),
    descriptions varchar (3000),
    PRIMARY KEY (collectionId)
)`;

    let [responses] = await pool.query(createCreditCollection);

    let createTableDailyTransaction = `create table if not exists dailyTransaction(dailySalesId int auto_increment,
      registeredBy int not null,
       mainProductId int, 
       purchaseQty float not null default 0,
        unitPrice float not null default 0, 
         unitCost float not null default 0, 
        salesQty float not null default 0 ,
         creditsalesQty float not null default 0, 
         salesTypeValues enum('On cash','By bank','On credit','Credit paied','Partially paied'),
         creditPaymentDate date,
          partiallyPaidInfo JSON,
           businessId int, 
           ProductId int, 
           brokenQty float, Description varchar(2000),
            registeredTimeDaily Date,
            itemDetailInfo varchar(9000), 
            reportStatus ENUM('unreported to total sales', 'reported to total sales'),
             inventoryItem float not null, 
             primary key(dailySalesId))`;
    pool
      .query(createTableDailyTransaction)
      .then((data) => {})
      .catch((error) => {});

    let create = `create table if not exists employeeTable(employeeId int auto_increment, hiredDate DATETIME, userIdInEmployee int,BusinessIDEmployee int, employerId int, primary key(employeeId))`;
    pool
      .query(create)
      .then(() => {})
      .catch(() => {});

    let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), uniqueBusinessName varchar(900) not null, createdDate DATETIME, ownerId int, status varchar(300), primary key(businessId))`;

    pool.query(creeateBusiness).then().catch();
    let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), passwordStatus varchar(40), passwordResetPin int, password varchar(200),primary key(userId))`;
    pool
      .query(queryTocreate)
      .then((data) => {})
      .catch((error) => {});
  } catch (error) {}
};

const createBusiness = async ({
  businessName,
  ownerId,
  createdDate,
  source,
}) => {
  try {
    const cleanBusinessName = businessName.replace(/[^A-Za-z0-9_]/g, "");
    let newBusinessName = cleanBusinessName;

    const selectQuery = `SELECT * FROM Business WHERE uniqueBusinessName = ?`;
    const insertQuery = `INSERT INTO Business (businessName, uniqueBusinessName, ownerId, createdDate) VALUES (?, ?, ?, ?)`;

    const registerMainBusinessName = async (nameOfBusiness) => {
      try {
        const [rows] = await pool.query(selectQuery, [nameOfBusiness]);
        if (rows.length === 0) {
          await pool.query(insertQuery, [
            businessName,
            nameOfBusiness,
            ownerId,
            createdDate,
          ]);
          return "Business Created";
        } else {
          const { BusinessID } = rows[0];
          newBusinessName = cleanBusinessName + "_" + BusinessID;
          return await registerMainBusinessName(newBusinessName);
        }
      } catch (error) {
        throw error;
      }
    };

    await registerMainBusinessName(newBusinessName);

    const tableNames = ["_expenses", "_Costs", "_products", "_Transaction"];
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS ?? (expenseId INT(11) NOT NULL AUTO_INCREMENT, costId INT(11) NOT NULL, registeredBy int, costAmount float(11) NOT NULL, costDescription VARCHAR(9000) NOT NULL, costRegisteredDate DATE NOT NULL, PRIMARY KEY (expenseId))`,
      `CREATE TABLE IF NOT EXISTS ?? (costsId INT(11) NOT NULL AUTO_INCREMENT, costName VARCHAR(3000) NOT NULL, registeredBy int, expItemRegistrationDate Date, unitCost float(11) NOT NULL, PRIMARY KEY (costsId))`,
      `CREATE TABLE IF NOT EXISTS ?? (ProductId INT(11) NOT NULL AUTO_INCREMENT, productRegistrationDate date, registeredBy int, mainProductId int, productsUnitCost float(11) NOT NULL, prevUnitCost float, productsUnitPrice float(11) NOT NULL, prevUnitPrice float, productName VARCHAR(900) NOT NULL, prevProductName varchar(1000), minimumQty float(11) NOT NULL, prevMinimumQty float, Status enum('active','changed','replaced','active_but_updated'), PRIMARY KEY (ProductId))`,
      `CREATE TABLE IF NOT EXISTS ?? (transactionId INT(11) NOT NULL AUTO_INCREMENT, unitCost INT(11) NOT NULL, registeredBy int, unitPrice float(11) NOT NULL, productIDTransaction INT(11) NOT NULL, mainProductId int, salesQty float(11) NOT NULL default 0, creditsalesQty float(11) NOT NULL default 0, purchaseQty float(11) NOT NULL default 0, wrickages INT(11) NOT NULL default 0, Inventory float(11) NOT NULL default 0, description VARCHAR(5000) NOT NULL, registeredTime DATE NOT NULL, creditDueDate date, salesTypeValues enum('On cash','By bank','On credit','Credit paied','Partially paied'), registrationSource enum('Total','Single'), partiallyPaidInfo JSON, creditPayementdate date, PRIMARY KEY (transactionId))`,
    ];

    const tableCollections = {};

    for (let i = 0; i < createTableQueries.length; i++) {
      const query = createTableQueries[i];
      const tableName = newBusinessName + tableNames[i];
      const [result] = await pool.query(query, [tableName]);
      tableCollections[query] = result.rowCount;
    }

    return {
      message: "Business created successfully",
    };
  } catch (error) {
    return { error: "Unable to create business" };
  }
};

const insertIntoUserTable = async (fullName, phoneNumber, password) => {
  try {
    const salt = bcript.genSaltSync();
    const encryptedPassword = bcript.hashSync(password, salt);

    const checkQuery = `SELECT * FROM usersTable WHERE phoneNumber = ?`;
    const [rows] = await pool.query(checkQuery, [phoneNumber]);

    if (rows.length > 0) {
      const token = JWT.sign({ userID: rows[0].userId }, "shhhhh");
      return { data: "This phone number is registered before.", token };
    } else {
      const insertQuery = `INSERT INTO usersTable (employeeName, phoneNumber, password) VALUES (?, ?, ?)`;
      const result = await pool.query(insertQuery, [
        fullName,
        phoneNumber,
        encryptedPassword,
      ]);
      const insertedId = result.insertId;
      const token = JWT.sign({ userID: insertedId }, "shhhhh");
      return { data: "Data is inserted successfully.", token };
    }
  } catch (error) {
    return { error: "An error occurred." };
  }
};

const deleteBusiness = async (body) => {
  try {
    let { businessName, businessId } = body;
    let sqlToGetBusiness = `select * from Business where BusinessID=?`;
    let businessRows = await executeQuery(sqlToGetBusiness, [businessId]);
    if (businessRows.length === 0) {
      return { data: "business not found" };
    }

    let uniqueBusinessName = businessRows[0]?.uniqueBusinessName;
    if (!uniqueBusinessName) {
      return { data: "business not found" };
    }
    let sql = `DELETE FROM Business WHERE BusinessID=?`;
    let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
    let tableLength = tables.length;
    let i = 0;
    let sqlValues = [businessId];

    const deleteEachTable = async () => {
      let drop = `DROP TABLE IF EXISTS ??`;
      let dropvalues = [uniqueBusinessName + tables[i]];

      try {
        await pool.query(drop, dropvalues);

        if (i === tableLength - 1) {
          const result = await pool.query(sql, sqlValues);
          return { data: "delete success" };
        } else if (i < tableLength - 1) {
          i++;
          return deleteEachTable(); // Return the promise to properly handle the async flow
        }
      } catch (error) {
        return {
          error: `error in deleting business`,
        };
      }
    };

    return deleteEachTable(); // Return the promise to properly handle the async flow
  } catch (error) {
    return { data: "error", error: "error no d1" };
  }
};

module.exports.deleteBusiness = deleteBusiness;
module.exports.insertIntoUserTable = insertIntoUserTable;
module.exports.createBusiness = createBusiness;
module.exports.createBasicTables = createBasicTables;
