let mysql = require("mysql");
let bcript = require("bcryptjs");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store",
});
connection.connect();
function createBasicTables() {
  let create = `create table if not exists employeeTable(employeeId int auto_increment, userIdInEmployee int,BusinessIDEmployee int, primary key(employeeId))`;
  connection.query(create, (err, result) => {
    if (err) console.log(err);
    if (result) console.log(result);
  });
  let creeateBusiness = `create table if not exists Business (BusinessID int auto_increment, BusinessName varchar(500), createdDate Date,ownerId int, status varchar(300), primary key(businessId))`;
  connection.query(creeateBusiness, (err, results) => {
    if (results) {
      if (err) console.log(err);
      console.log("results in create Business");
      console.log(results);
    }
  });
  let queryTocreate = `create table if not exists usersTable(userId int auto_increment, phoneNumber varchar(200),employeeName varchar(600), password varchar(200),primary key(userId))`;
  connection.query(queryTocreate, function (error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results);
  });
}
let createBusiness = (businessName, ownerId, createdDate, res, source) => {
  for (let i = 0; i <= businessName.length; i++) {
    if (businessName[i] == " ") {
      businessName[i] = "";
      // return res.json({ data: "space is not allowed in business name " });
    }
  }
  console.log("createBusiness");
  let select = `select * from Business where businessName='${businessName}'`;
  connection.query(select, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (result.length == 0) {
      let insert = `insert into Business (businessName,ownerId,createdDate)
       values('${businessName}','${ownerId}','${createdDate}') `;
      connection.query(insert, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("createdWell");
        }
      });
    } else {
      // res.json({ data: "alreadyRegistered" });
    }
    {
      let tableExpences = `create table if not exists ${businessName}_expenses(expenseId int auto_increment,costId int,costAmount int,costDescription varchar(9000),costRegisteredDate date,primary key(expenseId))`;
      connection.query(tableExpences, (err, results) => {
        if (err) console.log(err);
        if (result) {
          console.log(results);
        }
      });
      let costTable = `create table if not exists ${businessName}_Costs (costsId int auto_increment, costName varchar(3000),unitCost int, primary key(costsId))`;
      connection.query(costTable, (err, result) => {
        if (err) console.log(err);
        if (result) console.log(result);
      });

      let create = `create table if not exists ${businessName}_products(ProductId int auto_increment, productsUnitCost int, productsUnitPrice int ,productName varchar(900), primary key(ProductId))`;
      connection.query(create, (err, result) => {
        if (err) console.log(err);
        console.log(result);
      });
      let createTransaction = `create table if not exists ${businessName}_Transaction(transactionId int auto_increment,unitCost int,unitPrice int,productIDTransaction int,salesQty int, purchaseQty int, wrickages int,Inventory int,description varchar(5000), registeredTime Date, primary key (transactionId))`;
      connection.query(createTransaction, (err, result) => {
        if (err) console.log(err);
        if (result) {
          console.log(`${businessName}_Transaction created well`);
        }
      });
      res.json({ data: "created well", source });
    }
  });
};
let insertIntoUserTable = async (fullName, phoneNumber, password, res) => {
  // console.log(fullName,phoneNumber, password);
  //password encryption
  const salt = bcript.genSaltSync();
  //changing the value of password from req.body with the encrypted password
  const Encripted = bcript.hashSync(password, salt);
  let check = `select * from userstable where phoneNumber='${phoneNumber}'`;
  connection.query(check, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      if (results.length > 0) {
        res.json({ data: "This phone number is registered before." });
      } else {
        let insertIntoUsers = `insert into userstable (employeeName,phoneNumber,password) values('${fullName}','${phoneNumber}','${Encripted}')`;
        connection.query(insertIntoUsers, (err, result) => {
          if (err) console.log(err);
          else if (result) {
            console.log("first Data is inserted well");
            res.json({ data: "Data is inserted well." });
          }
        });
      }
    }
  });
};
module.exports.insertIntoUserTable = insertIntoUserTable;
module.exports.createBusiness = createBusiness;
module.exports.connection = connection;
module.exports.createBasicTables = createBasicTables;
console.log("module.exports", module.exports);
