const mysql = require("mysql2");
let bcript = require("bcryptjs");
/*
var connection = mysql.createConnection({
  host: "localhost",
  user: "masetawoshacom_stock",
  password: "DBcp123$%^",
  database: "masetawoshacom_store",
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "guzowaycom_guzowaycom",
  password: "+oyTI,&_)Mq$",
  database: "guzowaycom_stock",
 }); 
server side connection

*/
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
  let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), password varchar(200),primary key(userId))`;
  connection.query(queryTocreate, function (error, results, fields) {
    if (error) throw error;
    // console.log("The solution is: ", results);
  });
}
let createBusiness = (businessName, ownerId, createdDate, res, source) => {
  console.log("createBusiness");
  let select = `select * from Business where businessName='${businessName}'`;
  connection.query(select, (err, result) => {
    if (err) {
      return res.json({ err });
    }
    let tableCollections = {};
    if (result.length == 0) {
      let insert = `insert into Business (businessName,ownerId,createdDate)
       values('${businessName}','${ownerId}','${createdDate}') `;
      connection.query(insert, (err, results) => {
        if (err) {
          return res.json({ err });
        } else {
          console.log("createdWell");
        }
      });
      tableCollections.registerBusinessName = "regesteredAsNewBusiness";
    } else {
      tableCollections.registerBusinessName = "regesteredBefore";
      // res.json({ data: "alreadyRegistered" });
    }
    {
      let tableExpences = `create table if not exists ${businessName}_expenses(expenseId int auto_increment,costId int,costAmount int,costDescription varchar(9000),costRegisteredDate date,primary key(expenseId))`;

      let costTable = `create table if not exists ${businessName}_Costs (costsId int auto_increment, costName varchar(3000),unitCost int, primary key(costsId))`;
      connection.query(costTable, (err, result) => {
        if (err) return res.json({ err });
        if (result) {
          console.log(result);
          tableCollections._Costs = result.changedRows;
        }
      });

      let create = `create table if not exists ${businessName}_products(ProductId int auto_increment, productsUnitCost int, productsUnitPrice int ,productName varchar(900), primary key(ProductId))`;
      connection.query(create, (err, result) => {
        if (err) {
          return res.json({ err });
        }
        if (result) {
          tableCollections._products = result.changedRows;
        }
      });

      let createTransaction = `create table if not exists ${businessName}_Transaction(transactionId int auto_increment,unitCost int,unitPrice int,productIDTransaction int,salesQty int, purchaseQty int, wrickages int,Inventory int,description varchar(5000), registeredTime Date, primary key (transactionId))`;

      connection.query(createTransaction, (err, result) => {
        if (err) return res.json({ err });
        if (result) {
          tableCollections._Transaction = result.changedRows;
        }
      });
      connection.query(tableExpences, (err, results) => {
        if (err) return res.json({ err });
        if (results) {
          console.log("_expenses results", results, "");
          tableCollections._expenses = results.changedRows;
          res.json({ data: "created well", source, tableCollections });
        }
      });
    }
  });
};
let insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
  // console.log(fullName,phoneNumber, password);
  //password encryption
  const salt = bcript.genSaltSync();
  //changing the value of password from req.body with the encrypted password
  const Encripted = bcript.hashSync(password, salt);
  let check = `select * from usersTable where phoneNumber='${phoneNumber}'`;
  connection.query(check, (err, results) => {
    if (err) {
      return res.json({ err });
    } else {
      console.log(results);
      if (results.length > 0) {
        res.json({ data: "This phone number is registered before." });
      } else {
        let insertIntoUsers = `insert into usersTable (employeeName,phoneNumber,password) values('${fullName}','${phoneNumber}','${Encripted}')`;
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
let deleteBusiness = async (businessId, businessName, res) => {
  console.log("businessId in deleteBusiness", businessId);
  let sql = `delete from Business where BusinessID='${businessId}'`;
  let tables = ["_expenses", "_Costs", "_Transaction", "_products"];
  tables.map((items) => {
    let drop = `DROP TABLE ${businessName + items}`;
    connection.query(drop, (err, results) => {
      if (err) console.log(err);
      else console.log(results);
    });
  });
  let responces = connection.query(sql, (err, result) => {
    if (err) return res.json({ data: err });
    if (result) {
      console.log("result of deleted data is ", result);
      return res.json({ data: result });
    }
  });
  return responces;
};
module.exports.deleteBusiness = deleteBusiness;
module.exports.insertIntoUserTable = insertIntoUserTable;
module.exports.createBusiness = createBusiness;
module.exports.connection = connection;
module.exports.createBasicTables = createBasicTables;
// console.log("module.exports", module.exports);
