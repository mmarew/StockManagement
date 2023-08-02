let cors = require("cors");
let express = require("express");
let bcrypt = require("bcryptjs");
let Auth = require("./Auth.js").Auth;
let dotenv = require("dotenv");
let sqlstring = require("sqlstring");
let mysql2 = require("mysql2");
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-let
dotenv.config();
let path = "/";
let server = express();
server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

let createBasicTables = require("./Database.js");
let date = new Date();
let fullTime,
  year = date.getFullYear(),
  month = date.getMonth() + 1,
  day = date.getDate(),
  hour = date.getHours(),
  minuite = date.getMinutes(),
  second = date.getSeconds();

if (month < 10) {
  month = "0" + month;
}
if (day < 10) {
  day = "0" + day;
}
if (hour < 10) {
  hour = "0" + hour;
}
if (minuite < 10) {
  minuite = "0" + minuite;
}
if (second < 10) {
  second = "0" + second;
}
fullTime = year + "-" + month + "-" + day + "" + hour + ":" + minuite;
// console.log("fullTime is " + fullTime);
createBasicTables.createBasicTables();
let jwt = require("jsonwebtoken");
const { Pool } = require("./Database.js");
let Database,
  {
    deleteBusiness,
    insertIntoUserTable,
    createBusiness,
  } = require("./Database.js");
server.listen(process.env.serverPort, (err) => {
  if (err) {
    return res.json({ err });
  } else {
    // console.log(`connected at ${process.env.serverPort}`);
  }
});
server.post(path, (req, res) => {
  res.end(
    "<h1><center>This is server is running well in post methodes.</center></h1>"
  );
});
server.get(path, (req, res) => {
  res.end(
    "<h1><center>This is server is running well in get methodes.</center></h1>"
  );
});
server.post(path + "getBusiness/", (req, res) => {
  let tokens = req.body.token;

  if (!tokens) {
    return res.json({ data: "You haven't logged in before." });
  }

  try {
    let decoded = jwt.verify(tokens, "shhhhh");
    let userID = decoded.userID;

    let getBusiness = `SELECT * FROM Business WHERE ownerId = ?`;
    let myBusiness = "";
    let employeerBusiness = "";

    Pool.query(getBusiness, [userID])
      .then(([rows]) => {
        myBusiness = rows;

        let getEmployeerBusiness = `SELECT * FROM employeeTable, Business WHERE userIdInEmployee = ? AND Business.BusinessID = employeeTable.BusinessIDEmployee`;
        return Pool.query(getEmployeerBusiness, [userID]);
      })
      .then(([rows]) => {
        employeerBusiness = rows;
        res.json({ myBusiness, employeerBusiness });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
});
server.post(path + "verifyLogin/", async (req, res) => {
  let token = req.body.token;
  try {
    let decoded = jwt.verify(token, "shhhhh");
    let userID = decoded.userID;
    let select = `SELECT * FROM usersTable WHERE userId = ?`;

    Pool.query(select, [userID])
      .then(([rows]) => {
        if (rows.length > 0) {
          res.json({ data: "alreadyConnected", decoded, result: rows });
        } else {
          res.json({ data: "dataNotFound", decoded });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
});
server.post(path + "Login/", (req, res) => {
  console.log(req.body);
  console.log("req.body.phoneNumber", req.body.phoneNumber);

  let phoneNumber = req.body.phoneNumber;
  console.log("phoneNumber", phoneNumber);

  let select = `SELECT * FROM usersTable WHERE phoneNumber = ? LIMIT 1`;

  Pool.query(select, [req.body.phoneNumber])
    .then(([rows]) => {
      if (rows.length == 0) {
        return res.json({ data: "data not found" });
      }

      let savedPassword = rows[0].password;
      const isMatch = bcrypt.compareSync(req.body.Password, savedPassword);

      let token = jwt.sign({ userID: rows[0].userId }, "shhhhh");

      if (isMatch) {
        return res.json({
          data: "loginSuccessFull",
          token,
          usersFullName: rows[0].employeeName,
        });
      } else {
        return res.json({ data: "password mismatch" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
server.post(path + "RegisterUsers/", async (req, res) => {
  let registerPhone = req.body.registerPhone,
    registerPassword = req.body.registerPassword,
    fullName = req.body.fullName;
  let results = await insertIntoUserTable(
    fullName,
    registerPhone,
    registerPassword,
    res
  );
  // console.log("results is " + results);
});
server.post(path + "addProducts/", async (req, res) => {
  let rowData = req.body;
  let productName = rowData.productName;
  let productPrice = rowData.productUnitPrice;
  let productCost = rowData.productUnitCost;
  let businessId = rowData.businessId;
  let minimumQty = rowData.minimumQty;
  let userId = await Auth(rowData.token);

  let select = `SELECT * FROM Business WHERE businessId = ?`;
  Pool.query(select, [businessId])
    .then(([rows]) => {
      let result = rows;
      if (result.length == 0) {
        return res.json({ data: "businessNotFound", businessId });
      }

      let businessName = result[0].BusinessName;

      if (result[0].ownerId !== userId) {
        return res.json({ data: "notAllowedFroYou" });
      }

      let selectProduct = `SELECT productName FROM ?? WHERE productName = ?`;
      Pool.query(selectProduct, [`${businessName}_products`, productName])
        .then(([rows]) => {
          result = rows;
          if (result.length == 0) {
            let insertProduct = `INSERT INTO ?? (productsUnitCost, productsUnitPrice, productName, minimumQty) VALUES (?, ?, ?, ?)`;
            Pool.query(insertProduct, [
              `${businessName}_products`,
              productCost,
              productPrice,
              productName,
              minimumQty,
            ])
              .then(() => {
                return res.json({ data: "productIsAdded" });
              })
              .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
              });
          } else {
            return res.json({ data: "productIsAlreadyAddedBefore" });
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.sqlState == `42S02`) {
            console.log("please recreate tables again");
            createBusiness(businessName, userId, fullTime, res, "recreate");
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});
// i am here
server.post(path + "createBusiness/", (req, res) => {
  let businessName = req.body.businessName;
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let response = createBusiness(businessName, userID, fullTime, res);
});
server.post(path + "getRegisteredProducts/", async (req, res) => {
  // console.log(req.body.BusinessId, req.body.token, req.body.businessName);
  let validate = validateAlphabet(req.body.businessName, res);
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let select = "SELECT * FROM ??";
  let table = `${businessName}_products`;
  Pool.query(select, [table])
    .then(([rows]) => {
      console.log("in getRegisteredProducts", rows);
      res.json({ data: rows });
    })
    .catch((err) => {
      console.error(err);
      res.json({ error: "Unable to fetch data." });
    });
  // let select = `select * from ${businessName}_products`;
  // connection.query(select, (err, result) => {
  //   if (err) return res.json({ err });
  //   if (result) console.log(result);
  //   res.json({ data: result });
  // });
  // let userId = await Auth(req.body.token);
  // res.end("getRegisteredProducts lllllllllll");
});
// to be seen in mornning mind
server.post(path + "registerTransaction/", async (req, res) => {
  let ProductId = req.body.ProductId;
  let rowData = req.body,
    ProductsList = rowData.ProductsList,
    businessName = "",
    i = 0,
    previouslyRegisteredData = [],
    values = "",
    length = ProductsList.length,
    insertedProducts = [],
    InventoryList = [];

  let validate = validateAlphabet(req.body.businessName, res);
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let recurciveTorecheck = () => {
    let productID = ProductsList[i].ProductId,
      unitCost = ProductsList[i].productsUnitCost,
      unitPrice = ProductsList[i].productsUnitPrice,
      salesQuantity = "salesQuantity" + productID,
      purchaseQty = "purchaseQty" + productID,
      wrickageQty = "wrickageQty" + productID,
      Inventory = 0;
    console.log();
    let dates = req.body.dates;
    let selectToCheck = `select * from  ?? where registeredTime like ? and productIDTransaction=?`;
    let table = `${businessName}_Transaction`;
    let valuesOfTransactions = [table, `%${dates}%`, productID],
      values = "";
    Pool.query(selectToCheck, valuesOfTransactions)
      .then(([rows]) => {
        if (rows.length > 0) {
          // previouslyRegisteredData.push(resultOfQuery) collect previously registered
          previouslyRegisteredData.push(rows);

          // i == length - 1 at last status
          if (i == length - 1) {
            if (previouslyRegisteredData.length == length) {
              // previouslyRegisteredData.length - 1 == length - 1 are all registered before or not
              return res.json({
                data: "allDataAreRegisteredBefore",
                previouslyRegisteredData,
                date: req.body.dates,
                values,
              });
            } else {
              console.log("values @ 1", values);
              // return;
              let insert = `insert into ${businessName}_Transaction(unitCost,unitPrice,productIDTransaction,salesQty,purchaseQty,registeredTime,wrickages,Inventory) values (?)`;
              let insertValues = [values.split(",")];
              Pool.query(insert, insertValues)
                .then((result) => {
                  updateNextDateInventory(
                    `${businessName}_Transaction`,
                    insertedProducts,
                    req.body.dates,
                    InventoryList
                  );
                  return res.json({
                    data: "data is registered successfully",
                    previouslyRegisteredData,
                  });
                })
                .catch((error) => {
                  console.log("error on 9090", error);
                  res.json({ data: error });
                });
            }
          } else {
            console.log("recall to recursive");
            i++;
            recurciveTorecheck();
          }
        } else {
          insertedProducts.push(ProductsList[i]);
          // let prevInventory = `select * from ${businessName}_Transaction where productIDTransaction= ${(
          //   productID
          // )} and registeredTime < ${(
          //   req.body.dates
          // )} order by registeredTime desc limit 1`;
          let prevInventory =
            "SELECT * FROM ?? WHERE productIDTransaction = ? AND registeredTime < ? ORDER BY registeredTime DESC LIMIT 1";
          let table = `${businessName}_Transaction`;
          let valuesOfTransaction = [table, productID, req.body.dates];

          Pool.query(prevInventory, valuesOfTransaction)
            .then(([rows]) => {
              if (rows.length == 0) {
                // console.log("no data found");
                Inventory = 0;
              } else {
                Inventory = rows[0].Inventory;
              }

              Inventory =
                parseInt(rowData[purchaseQty]) -
                parseInt(rowData[salesQuantity]) +
                parseInt(Inventory) -
                parseInt(rowData[wrickageQty]);
              // console.log(
              //   "rows=",
              //   rows,
              //   "purchaseQty",
              //   parseInt(rowData[purchaseQty]),
              //   "salesQuantity",
              //   parseInt(rowData[salesQuantity]),
              //   "Inventory",
              //   parseInt(Inventory),
              //   "wrickageQty",
              //   parseInt(rowData[wrickageQty])
              // );
              // console.log("typeof Inventory is ", typeof Inventory);
              // return;
              if (typeof Inventory == "string") {
                // console.log(
                //   "Inventory is not number this may be in purchaseQty,salesQuantity,Inventory,wrickageQty"
                // );
                return res.json({ data: "error", error: "error code 678," });
              }
              InventoryList.push(Inventory);
              if (values != "") {
                values += ",";
              }
              values = `${unitCost} , ${unitPrice} , ${productID} , ${rowData[salesQuantity]} , ${rowData[purchaseQty]} , ${req.body.dates} , ${rowData[wrickageQty]} , ${Inventory}`;

              console.log("values are ", values.split(","));
              // return;

              if (i == length - 1) {
                if (previouslyRegisteredData.length == length) {
                  // previouslyRegisteredData.length - 1 == length - 1 are all registered before or not
                  return res.json({
                    data: "allDataAreRegisteredBefore",
                    previouslyRegisteredData,
                    date: req.body.dates,
                    values,
                  });
                } else {
                  let insert = `insert into ${businessName}_Transaction (unitCost,unitPrice,productIDTransaction,salesQty,purchaseQty,registeredTime,wrickages,Inventory)values(?) `;
                  // insertvalues = values;
                  Pool.query(insert, [values.split(",")])
                    .then((result) => {
                      {
                        // console.log(result);
                        updateNextDateInventory(
                          `${businessName}_Transaction`,
                          insertedProducts,
                          req.body.dates,
                          InventoryList
                        );
                        return res.json({
                          data: "data is registered successfully",
                          previouslyRegisteredData,
                          values,
                        });
                      }
                    })
                    .catch((error) => {
                      console.log("err on insert == ", error);
                      return res.json({ data: "err", error });
                    });
                }
              } else {
                // increase i by 1
                // recal to recursive
                console.log("recall to recursive");
                i++;
                recurciveTorecheck();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log("error ", error);
        res.json({ data: error });
      });
  };
  recurciveTorecheck();
});
server.post(path + "ViewTransactions/", (req, res) => {
  let businessName = "",
    time = req.body.time;
  let validate = validateAlphabet(req.body.businessName, res);
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  const transactionTable = `${businessName}_Transaction`;
  const productsTable = `${businessName}_products`;
  const select = `SELECT * FROM ?? t INNER JOIN ?? p ON p.productId = t.productIDTransaction WHERE t.registeredTime LIKE ?`;
  const timeDate = `%${time}%`;
  const values = [transactionTable, productsTable, time];

  // console.log("select is select", select);
  // return;
  let salesTransaction = [],
    expenseTransaction = "";
  Pool.query(select, values)
    .then(([rows]) => {
      {
        salesTransaction = rows;
        //       let selectCost = `select * from ${businessName}_expenses, ${businessName}_Costs where
        // ${businessName}_expenses.costId=${businessName}_Costs.costsId and costRegisteredDate=${time}`;

        const selectCostQuery =
          "SELECT * FROM ??_expenses, ??_Costs WHERE ??_expenses.costId = ??_Costs.costsId AND costRegisteredDate = ?";
        const params = [
          businessName,
          businessName,
          businessName,
          businessName,
          time,
        ];

        Pool.query(selectCostQuery, params)
          .then(([rows]) => {
            {
              expenseTransaction = rows;
              res.json({ expenseTransaction, salesTransaction });
            }
          })
          .catch((error) => {
            res.json({ error });
          });
      }
    })
    .catch((error) => {
      res.json({ data: "data is full of err " });
    });
});
server.post(path + "updateTransactions/", async (req, res) => {
  // console.log("@updateTransactions" ,req.body);
  // return;
  let currentInventory = "",
    prevInventory = "";
  let previous = getPreviousDay(new Date(req.body.date));
  let validate = validateAlphabet(req.body.businessName, res),
    businessName = "";
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let productId = req.body.productId;
  const selectQuery =
    "SELECT * FROM ?? WHERE registeredTime LIKE ? AND productIDTransaction = ?";
  const params = [`${businessName}_Transaction`, `%${previous}%`, productId];

  let update = "";
  Pool.query(selectQuery, params)
    .then(([rows]) => {
      console.log("result on update ", result);
      currentInventory =
        parseInt(req.body.purchaseQty) -
        parseInt(req.body.salesQty) -
        parseInt(req.body.wrickages);
      if (rows.length > 0) currentInventory += prevInventory;
      //       update = `update ${businessName}_Transaction set
      // wrickages='${req.body.wrickages}',
      // purchaseQty='${req.body.purchaseQty}',
      // salesQty='${req.body.salesQty}',
      // Inventory='${currentInventory}',
      // description='${req.body.Description}'
      //  where transactionId='${req.body.transactionId}'`;
      // console.log("my update is ==", update);
      const updateQuery = `UPDATE ?? SET wrickages = ?, purchaseQty = ?, salesQty = ?, Inventory = ?, description = ? WHERE transactionId = ?`;
      const params = [
        `${businessName}_Transaction`,
        req.body.wrickages,
        req.body.purchaseQty,
        req.body.salesQty,
        currentInventory,
        req.body.Description,
        req.body.transactionId,
      ];

      Pool.query(updateQuery, params)
        .then((results) => {
          console.log(results);
          res.json({ data: results, update });
        })
        .then((error) => {
          res.json({ err: error });
        });
      // console.log("currentInventory " + currentInventory);
      return result;
    })
    .catch((error) => {
      res.json({ data: error, error });
    });
});
async function getPreviousDay(date) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  let previousFormat = new Date(previous),
    previousDay = "";
  previousDay =
    previousFormat.getFullYear() +
    "-0" +
    (previousFormat.getMonth() + 1) +
    "-" +
    previousFormat.getDate();
  // console.log("previousDay = " + previousDay);

  return previousDay;
}
server.post(path + "searchProducts/", (req, res) => {
  let businessName = "",
    productName = req.body.InputValue.productName,
    toDate = req.body.InputValue.toDate,
    fromDate = req.body.InputValue.fromDate,
    selectSearches = req.body.InputValue.selectSearches;
  // console.log( businessName,toDate, fromDate, " = selectSearches = " + selectSearches  );
  let validate = validateAlphabet(req.body.businessName, res);
  if (validate == "correctData") {
    businessName = req.body.InputValue.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  if (selectSearches == "PRODUCTS") {
    let selectProducts = `select * from ??`;
    let tableName = `${businessName}_products`;
    Pool.query(selectProducts, [tableName])
      .then(([rows]) => {
        res.json({ data: "no results", products: rows });
      })
      .catch((Error) => {
        res.json({ Error });
      });
  } else if (selectSearches == "TRANSACTION") {
    // let select = `select * from ${businessName}_Transaction , ${businessName}_products where productIDTransaction=ProductId and productName like '%\n${(
    //   productName
    // )}\n%' and registeredTime between '${fromDate}' and '${toDate}'`;
    // connection.query(select, (err, result) => {
    // define the SQL query using placeholders
    // const sql = `SELECT *
    //          FROM ${businessName}_Transaction, ${businessName}_products
    //          WHERE productIDTransaction = ProductId
    //          AND productName LIKE CONCAT('%', ?, '%')
    //          AND registeredTime BETWEEN ? AND ?`;
    const query = `SELECT *
               FROM ??, ??
               WHERE productIDTransaction = ProductId
               AND productName LIKE CONCAT('%', ?, '%')
               AND registeredTime BETWEEN ? AND ?`;

    const table1 = `${businessName}_Transaction`;
    const table2 = `${businessName}_products`;
    // define the input data as an array of values
    const input = [];
    Pool.query(query, [table1, table2, productName, fromDate, toDate])
      .then(([rows]) => {
        res.json({ data: rows });
      })
      .catch((error) => {
        res.json({ error });
      });
  } else if (selectSearches == "ALLTRANSACTION") {
    console.log("in ALLTRANSACTION req.body == ", req.body);
    const sql = `SELECT * FROM ?? t, ?? p  WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? AND ?`;
    // define the input data as an array of values
    const input = [
      `${businessName}_Transaction`,
      `${businessName}_products`,
      fromDate,
      toDate,
    ];
    let data = "";
    // execute the query with the input data
    Pool.query(sql, input)
      .then(([rows]) => {
        data = rows;
        console.log("data in all", rows);
        const sql = `SELECT * FROM ?? e, ?? c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
        // define the input data as an array of values
        const input = [
          `${businessName}_expenses`,
          `${businessName}_Costs`,
          fromDate,
          toDate,
        ];

        // execute the query with the input data
        Pool.query(sql, input)
          .then(([rows]) => {
            res.json({ expenceTransaction: rows, data });
          })
          .catch((error) => {
            res.json({ err: error });
          });

        // res.json({ data });
      })
      .catch((error) => {
        console.log("error in alltransaction", error);
        res.json({ data: error, error: "9090" });
      });
  } else if (selectSearches == "COSTS") {
    console.log("in cost req.body==", req.body);
    let selectCost = `select * from??`;
    let costValues = `${businessName}_Costs`;
    Pool.query(selectCost, costValues)
      .then(([rows]) => {
        return res.json({ data: rows });
      })
      .catch((error) => {
        console.log("err is", error);
        return res.json({ data: "error 678" });
      });
  } else {
    res.json({ data: "Bad request.", products: "Bad request", selectSearches });
  }
});

server.post(path + "updateProducts/", (req, res) => {
  // console.log(req.body);
  let productPrice = req.body.productPrice,
    productName = req.body.productName,
    productCost = req.body.productCost,
    businessName = req.body.businessName,
    id = req.body.id,
    minimumQty = req.body.minimumQty;
  // let update = `update ${businessName}_products set productsUnitCost='${productCost}', productsUnitPrice='${productPrice}', productName='${productName}', minimumQty='${minimumQty}' where  ProductId='${id}'`;

  // define the SQL query using placeholders
  const sql = `UPDATE ?? SET productsUnitCost = ?,  productsUnitPrice = ?,   productName = ?,  minimumQty = ?  WHERE ProductId = ?`;

  // define the input data as an array of values
  const input = [
    `${businessName}_products`,
    productCost,
    productPrice,
    productName,
    minimumQty,
    id,
  ];

  // execute the query with the input data
  Pool.query(sql, input)
    .then((results) => {
      res.json({ data: "updated well" });
    })
    .catch((error) => {
      res.json({ err: error });
    });
});
server.post(path + "AddCostItems/", async (req, res) => {
  // console.log(req.body);
  let myId = await Auth(req.body.token);
  const sql = "SELECT * FROM Business WHERE BusinessName = ? AND ownerId = ?";
  // define the input data as an array of values
  const input = [req.body.businessName, myId];
  // execute the query with the input data
  Pool.query(sql, input)
    .then(([rows]) => {
      // connection.query(select, (err, result) => {

      console.log("result is ===", rows);
      if (rows.length > 0) {
        insertIntoCosts(`${req.body.businessName}_Costs`, req.body, res);
        return;
      }
      res.json({ data: "notallowedToU" });
    })
    .catch((error) => {
      console.log(err);
      return res.json({ data: "err", error });
    });
});
server.post(path + "getCostLists/", (req, res) => {
  // console.log(req.body);
  let validate = validateAlphabet(req.body.businessName, res),
    businessName = "";
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let select = `select * from ??`;
  Pool.query(select, [`${businessName}_Costs`])
    .then(([rows]) => {
      console.log("line 458", rows);
      res.json({
        data: rows,
      });
      //// console.log(businessName);
    })
    .catch((error) => {
      res.json({ data: "err", err: error });
    });
});
server.post(`/registerCostTransaction/`, (req, res) => {
  // console.log("in registerCostTransaction = ", req.body.costData[0].costsId);
  // return;
  let costData = req.body.costData,
    date = req.body.costDate,
    rowData = req.body;
  // define the SQL query using placeholders for the table name and date parameter
  const sql = "SELECT * FROM ?? WHERE costRegisteredDate = ? and costId=?";
  let costId = req.body.costData[0].costsId;
  // define the input data as an array of values
  const input = [`${req.body.businessName}_expenses`, date, costId];
  // execute the query with the input data
  Pool.query(sql, input)
    .then(([rows]) => {
      if (rows.length > 0) {
        return res.json({ data: "registered before" });
      } else {
        let i = 0;
        let costsId = costData[i].costsId,
          costName = costData[i].costName;
        costName = costName.replace(/ /g, "");
        let Description = "Description_" + costName;
        let costAmount = rowData[costName],
          costDescription = rowData[Description];
        const table = `${req.body.businessName}_expenses`;
        const insert = `INSERT INTO ?? (costId, costAmount, costDescription, costRegisteredDate) VALUES (?, ?, ?, ?)`;
        const values = [table, costsId, costAmount, costDescription, date];
        Pool.query(insert, values)
          .then((results) => {
            res.json({ data: "Inserted properly" });
          })
          .catch((error) => {
            console.log("error");
            res.json({ data: "error", error: "unable to insert" });
          });
      }
    })
    .catch((error) => {
      res.json({ err: error });
    });
});
server.post(path + "updateBusiness/", (req, res) => {
  // return res.json({ data: "updateBusiness/" });

  let businessName = req.body.businessName + "_expenses",
    costAmount_ = req.body.costAmount_,
    costDescription_ = req.body.costDescription_;

  // Sanitize user input
  const sanitizedBusinessName = mysql2.escape(businessName);
  const sanitizedCostAmount = mysql2.escape(costAmount_);
  const sanitizedCostDescription = mysql2.escape(costDescription_);
  const sanitizedExpenseId = mysql2.escape(req.body.ids);

  // Build the sanitized SQL query
  const updateQuery = `UPDATE ${sanitizedBusinessName} SET costAmount=${sanitizedCostAmount}, costDescription=${sanitizedCostDescription} WHERE expenseId=${sanitizedExpenseId}`;
  // Execute the sanitized query using a connection from the pool
  Pool.execute(updateQuery)
    .then(([result]) => {
      // Log the result
      console.log(result);
      // Return a success message in the response JSON
      res.json({
        data: "updated well",
      });
    })
    .catch((err) => {
      // Handle any errors
      console.error("MySQL error:", err);
      res.json({ err });
    });
});
let updateNextDateInventory = (
  businessName,
  ProductsList,
  date,
  previousInventory
) => {
  console.log("638 = ", businessName, ProductsList, date, previousInventory);
  let index = 0;
  let recurciveUpdate = () => {
    let productId = ProductsList[index].ProductId,
      select = `select * from ?? where productIDTransaction=? and registeredTime>? order by registeredTime asc`;
    let values = [`${businessName}`, productId, date];
    Pool.query(select, values)
      .then(([rows]) => {
        console.log("select is = ", select, "results are =", results);
        if (rows.length > 0) {
          let j = 0,
            prevInventory = 0;
          for (let i = 0; i < results.length; i++) {
            let salesqty = results[i].salesQty,
              purchaseQty = results[i].purchaseQty,
              inventory = 0,
              wrickages = results[i].wrickages;
            if (i == 0) {
              inventory =
                purchaseQty + previousInventory[index] - salesqty - wrickages;
            } else {
              inventory = purchaseQty + prevInventory - salesqty - wrickages;
            }
            prevInventory = inventory;
            let update = `update ?? set inventory=? where transactionId=?`;
            let valuesToUpdate = [
              `${businessName}`,
              `${inventory}`,
              `${results[i].transactionId}`,
            ];
            // previousInventory = inventory;
            Pool.query(update, valuesToUpdate)
              .then((results) => {
                if (results) {
                  if (index < ProductsList.length - 1) {
                    if (j == results.length - 1) {
                      index++;
                      recurciveUpdate();
                    }
                  }
                  j++;
                  // console.log("updated " + results1);
                } else {
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({ err });
              });
          }
        } else {
          if (index < ProductsList.length - 1) {
            index++;
            recurciveUpdate();
          }
        }
        // return res.json({ data: req.body });
      })
      .catch((error) => {
        console.log(error);
        // res.json({ error });
      });
  };
  recurciveUpdate();
};
function insertIntoCosts(businessName, data, res) {
  const sanitizedCostName = mysql2.escape(data.Costname);
  // Build the sanitized SQL query
  const checkQuery = `SELECT * FROM ?? WHERE costName=${sanitizedCostName}`;
  let values = [businessName];
  Pool.query(checkQuery, values)
    .then(([rows]) => {
      let result = rows;
      if (result.length > 0) {
        return res.json({ data: "already registered before" });
      } else {
        let insert = `insert into ?? (costName) values(${sanitizedCostName})`;
        values = [businessName];
        Pool.query(insert, values)
          .then(([rows]) => res.json({ data: "Registered successfully" }))
          .catch((error) => res.json({ err: error }));
      }
    })
    .catch((error) => {
      return res.json({ error });
    });
}
// pool system has to be tested
server.post(path + "updateBusinessName/", async (req, res) => {
  let businessName = req.body.businessname,
    targetBusinessId = req.body.targetBusinessId;
  const query = `SELECT * FROM Business WHERE businessName = ? AND businessId != ?`;
  const values = [businessName, targetBusinessId];
  Pool.query(query, values)
    .then(([rows]) => {
      const verifyName = rows;
      if (rows.length > 0) {
        return res.json({ data: "reservedByOtherBusiness", results });
      } else {
        let oldBusinessName = "";
        let getOldtableName = `select * from Business where businessId=?`,
          v = targetBusinessId;

        Pool.query(getOldtableName, [v])
          .then(([result]) => {
            if (result) {
              // console.log(results);
              oldBusinessName = result[0].BusinessName;
              // res.json({ data: `${oldBusinessName}_products`, results });
              // return;
              // let alter_products = `ALTER TABLE  ${oldBusinessName}_products RENAME TO ${businessName}_products`;

              // let updateBusinessName = `update Business set businessName='${oldBusinessName}' where businessId='${targetBusinessId}' and businessName='${businessName}'`;
              const query_updateBusinessName =
                "UPDATE Business SET businessName = ? WHERE businessId = ? AND businessName = ?";
              const values_updateBusinessName = [
                businessName,
                targetBusinessId,
                oldBusinessName,
              ];

              Pool.query(query_updateBusinessName, values_updateBusinessName)
                .then(([result]) => {
                  console.log("Update successful:", result);
                  // Do something else
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                  // Handle the error
                });

              const query = "ALTER TABLE ?? RENAME TO ??";
              const values = [
                `${oldBusinessName}_products`,
                `${businessName}_products`,
              ];
              Pool.query(query, values)
                .then(() => console.log("_products created well"))
                .catch((error) => res.json({ error }));

              const query_expenses = "ALTER TABLE ?? RENAME TO ??";
              const values_expenses = [
                `${oldBusinessName}_expenses`,
                `${businessName}_expenses`,
              ];

              Pool.query(query_expenses, values_expenses)
                .then(() => {
                  console.log("Table _expenses renamed successfully");
                  // Do something else
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                  // Handle the error
                });

              // let alter_transaction = `ALTER TABLE ${oldBusinessName}_Transaction RENAME TO ${businessName}_Transaction`;
              // connection.query(alter_transaction, (err, result) => {
              //   if (err) return res.json({ err });
              //   if (result) console.log(result);
              // });
              const query_Transaction = "ALTER TABLE ?? RENAME TO ??";
              const values_Transaction = [
                `${oldBusinessName}_Transaction`,
                `${businessName}_Transaction`,
              ];

              Pool.query(query_Transaction, values_Transaction)
                .then(() => {
                  console.log("Table query_Transaction renamed successfully");
                  // Do something else
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                  // Handle the error
                });
              // let alter_Costs = `ALTER TABLE ${oldBusinessName}_Costs RENAME TO ${businessName}_Costs`;
              const query_Costs = "ALTER TABLE ?? RENAME TO ??";
              const values_Costs = [
                `${oldBusinessName}_Costs`,
                `${businessName}_Costs`,
              ];

              Pool.query(query_Costs, values_Costs)
                .then(() => {
                  console.log("Table query_Costs renamed successfully");
                  // Do something else
                  res.json({ data: "update is successfull" });
                })
                .catch((error) => {
                  console.error("An error occurred:", error);
                  // Handle the error
                });
              // connection.query(alter_Costs, (err, result) => {
              //   if (err) {
              //     console.log(err);
              //     return res.json({ err });
              //   }
              //   if (result) {
              //     console.log(result);
              //   }

              //   let update = `update Business set businessName='${businessName}' where businessId='${targetBusinessId}'`;
              //   // { businessname: 'waterBusiness', targetBusinessId: 37 }

              //   connection.query(update, (err, result) => {
              //     if (err) {
              //       console.log(err);
              //       return res.json({ err });
              //     }
              //     if (result) {
              //       // console.log(result);
              //     }
              //   });
              // });
            }
          })
          .catch((error) => {
            return res.json({ error });
          });
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Handle the error
    });
  // return;
  // let veifyName = `select * from Business where businessName='${businessName}' and  businessId!='${targetBusinessId}'`;
  // console.log("Pool is == ", Pool);
  // Pool.execute(veifyName)
  //   .then((results) => {
  //     console.log("results ===", results);
  //     return;
  //     if (results) {
  //       if (results.length > 0) {
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     res.json({ data: "error", error });
  //   });

  //////////////////
});
// ////////////////
server.post(path + "searchEmployee/", (req, res) => {
  let employeeNameToBeSearched = req.body.employeeNameToBeSearched,
    businessId = req.body.businessId;
  const query =
    "SELECT * FROM usersTable WHERE phoneNumber LIKE ? OR employeeName LIKE ?";
  const values = [
    `%${employeeNameToBeSearched}%`,
    `%${employeeNameToBeSearched}%`,
  ];
  Pool.query(query, values)
    .then(([rows]) => {
      let result = rows;

      const queryEmployee = ` SELECT * FROM usersTable INNER JOIN employeeTable ON userId = userIdInEmployee WHERE phoneNumber LIKE ? OR employeeName LIKE ? AND BusinessIDEmployee = ? `;
      const valuesEmployees = [
        `%${employeeNameToBeSearched}%`,
        `%${employeeNameToBeSearched}%`,
        businessId,
      ];

      Pool.query(queryEmployee, valuesEmployees)
        .then(([rows]) => {
          let result1 = rows;
          res.json({ data: { result, result1 } });
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Handle the error
    });
});
server.post(path + "addEmployee/", async (req, res) => {
  let rowData = req.body,
    name = rowData.name,
    phone = rowData.phone,
    businessId = rowData.businessId,
    userId = rowData.userId;
  // console.log("rowData is ");
  // console.log(rowData);
  let employerId = await Auth(req.body.storeToken);
  // return;
  // let check = `select * from employeeTable,Business where userIdInEmployee=${userId} and BusinessID=${businessId} and BusinessIDEmployee=BusinessID`;
  const query =
    "SELECT * FROM employeeTable INNER JOIN Business ON BusinessIDEmployee = BusinessID WHERE userIdInEmployee = ? AND BusinessID = ?";
  const values = [userId, businessId];
  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
      // Do something else
      if (rows.length > 0) {
        res.json({ data: "data is already registered bofore" });
      } else {
        const query1 =
          "INSERT INTO employeeTable (userIdInEmployee, BusinessIDEmployee, employerId) VALUES (?, ?, ?)";
        const values1 = [userId, businessId, employerId];

        Pool.query(query1, values1)
          .then(([result]) => {
            console.log("Insert successful:", result);
            // Do something else
            res.json({ data: "data is inserted correctly." });
          })
          .catch((error) => {
            console.error("An error occurred:", error);
            // Handle the error
          });
        return;
        let insert = `insert into employeeTable(userIdInEmployee,BusinessIDEmployee,employerId)values('${userId}','${businessId}','${employerId}')`;
        connection.query(insert, (err, result) => {
          if (err) return res.json({ data: err, err });
          if (result) {
            //
            // console.log(result);
          }
        });
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return res.json({ err });
      // Handle the error
    });
});
server.post(path + "getBusinessEmployee/", (req, res) => {
  // console.log(req.body);
  console.log("req.body.businessId " + req.body.businessId);
  // let select = `select
  //   employeeId,
  //   userIdInEmployee,
  //   BusinessIDEmployee,
  //   BusinessID,
  //   BusinessName,
  //   createdDate,
  //   ownerId,
  //   status,
  //   userId,
  //   phoneNumber,
  //   employeeName from employeeTable,Business,usersTable where userId=userIdInEmployee and BusinessIDEmployee=BusinessID and BusinessID='${req.body.businessId}'`;
  const query = `SELECT employeeId, userIdInEmployee, BusinessIDEmployee, BusinessID, BusinessName, createdDate, ownerId, status, userId, phoneNumber, employeeName
               FROM employeeTable
               INNER JOIN Business ON BusinessIDEmployee = BusinessID
               INNER JOIN usersTable ON userIdInEmployee = userId
               WHERE BusinessID = ?`;
  const values = [req.body.businessId];

  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
      // Do something else
      res.json({ data: rows });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Handle the error
      res.json({ data: "Error", error: "error to get employees" });
    });
});
server.post(path + "removeEmployees/", (req, res) => {
  // console.log(req.body);
  const query = "DELETE FROM employeeTable WHERE employeeId = ?";
  const values = [req.body.employeeId];

  Pool.query(query, values)
    .then(([result]) => {
      console.log("Delete successful:", result);
      // Do something else
      res.json({ Status: "deleted", EmployeeId: req.body.employeeId });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Handle the error
      res.json({ err: error });
    });
  return;
  let deleteEmployee = `delete from employeeTable where employeeId='${req.body.employeeId}'`;
  connection.query(deleteEmployee, (err, results) => {
    if (err) {
      return;
      return;
    }

    // console.log(results);
  });
});
server.post(path + "registerEmployeersProducts/", (req, res) => {
  let TranactionProducts = req.body.tranactionProducts,
    EmployeersProduct = req.body.EmployeersProduct;
  // console.log("TranactionProducts = ", TranactionProducts,    "EmployeersProduct = ",  EmployeersProduct );
  let ProductId = EmployeersProduct[0].ProductId;
  //  { purchase_1: '456', sales_1: '400', Wrickage_1: '6' }
  let purchase_ = "purchase_" + ProductId,
    sales_ = "sales_" + ProductId,
    Wrickage_ = "Wrickage_" + ProductId;
  // console.log("EmployeersProduct[0]", EmployeersProduct[0]);
  // console.log();
  let purchaseQty = TranactionProducts[purchase_],
    salesQty = TranactionProducts[sales_],
    wrickageQty = TranactionProducts[Wrickage_];
  // console.log(purchaseQty, salesQty, wrickageQty);
  res.json({ data: req.body });
});
server.post(path + "getsingleProducts/", (req, res) => {
  let businessName = req.body.businessName,
    productName = req.body.searchInput;
  const query = `SELECT * FROM ?? WHERE productName LIKE ?`;
  const values = [`${businessName}_products`, "%" + productName + "%"];
  console.log("values==", values, "query==", query);
  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
      // Do something else
      res.json({ data: rows });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      res.json({ data: "error 400" });
      // Handle the error
    });
});
server.post(path + "registerSinglesalesTransaction/", (req, res) => {
  let Description = req.body.Description,
    brokenQty = req.body.brokenQty,
    businessId = req.body.businessId,
    purchaseQty = req.body.purchaseQty,
    salesQty = req.body.salesQty,
    ProductId = req.body.ProductId,
    currentDate = req.body.currentDate;

  const query = `INSERT INTO dailyTransaction (purchaseQty, salesQty, businessId, ProductId, brokenQty, Description, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    purchaseQty,
    salesQty,
    businessId,
    ProductId,
    brokenQty,
    Description,
    currentDate,
  ];

  Pool.query(query, values)
    .then(([result]) => {
      console.log(`Inserted ${result.affectedRows} row(s)`);
      // Do something else
      res.json({ data: "successfullyRegistered" });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      res.json({ data: "err", err: error });
      // Handle the error
    });
  return;

  let Insert = `insert into dailyTransaction(purchaseQty,salesQty,businessId,ProductId,brokenQty,Description,registrationDate)value('${purchaseQty}','${salesQty}','${businessId}','${ProductId}','${brokenQty}','${Description}','${currentDate}')`;

  connection.query(Insert, (error, results) => {
    if (error) {
      // console.log(error);
    }
    if (results) {
      res.json({ data: "successfullyRegistered" });
    }
  });
});
server.post(path + "getDailyTransaction/", (req, res) => {
  // res.json({ data: req.body });
  let productId = req.body.productId,
    businessId = req.body.businessId,
    currentDates = req.body.currentDates,
    businessName = req.body.businessName,
    getTransaction = "";
  // return res.json({ data: "res.data" + currentDates });
  let query, values;

  if (productId === "getAllTransaction") {
    query = `
    SELECT *
    FROM ?? AS dt
    JOIN ?? AS bp
    ON bp.ProductId = dt.ProductId
    WHERE dt.businessId = ?
    AND dt.registrationDate = ?
  `;
    values = [
      "dailyTransaction",
      `${businessName}_products`,
      businessId,
      currentDates,
    ];
  } else {
    query = `
    SELECT *
    FROM ?? AS dt
    JOIN ?? AS bp
    ON bp.ProductId = dt.ProductId
    WHERE dt.businessId = ?
    AND dt.ProductId = ?
    AND dt.registrationDate = ?
  `;
    values = [
      "dailyTransaction",
      `${businessName}_products`,
      businessId,
      productId,
      currentDates,
    ];
  }
  // return;

  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
      // Do something else
      res.json({ data: rows, getTransaction });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      // Handle the error
    });
});
server.post(path + "deleteBusines/", async (req, res) => {
  deleteBusiness(req.body.businessId, req.body.businessName, res);
});
server.post(path + "getMyProfile/", async (req, res) => {
  let userId = await Auth(req.body.myToken);
  console.log("userId", userId);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userId];
  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
      res.json({ data: rows });
    })
    .catch((error) => {
      res.json({ data: "error No 5" });
      console.error("An error occurred:", error);
    });
});
server.post(path + "updateUsers", async (req, res) => {
  // return res.json({ data: "it is ok" });
  let fullName = req.body.fullName,
    phoneNumber = req.body.phoneNumber,
    oldPassword = req.body.oldPassword,
    newPassword = req.body.newPassword,
    myToken = req.body.myToken;
  const salt = bcrypt.genSaltSync();
  //changing the value of password from req.body with the encrypted password
  const Encripted = bcrypt.hashSync(newPassword, salt);
  // console.log("Encripted", Encripted);
  let userID = await Auth(myToken);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userID];

  Pool.query(query, values)
    .then(([rows]) => {
      console.log(rows);
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

        Pool.query(query, values)
          .then(([result]) => {
            res.json({ data: "your data is updated" });
          })
          .catch((error) => {
            console.error(error);
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
        //       console.log(err);
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
      console.error("An error occurred:", error);
      // Handle the error
      res.json({ data: "error 06" });
    });
  return;
  let Select = `select * from usersTable where userId='${userID}'`;
  connection.query(Select, (err, results) => {
    if (err) {
      console.log(err);
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
              console.log(err);
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

server.post(path + "deleteUsers/", async (req, res) => {
  let userID = await Auth(req.body.storeToken);
  console.log("myId", userID);
  // console.log(res.json({ data: myId }));

  let SelectAll = `SELECT * FROM usersTable WHERE userId = ?`;
  let selectBusiness = `SELECT * FROM Business WHERE ownerId = ?`;
  let Drop = `DROP TABLE IF EXISTS ??, ??, ??, ??, ??`;
  let deleteBusiness = `DELETE Business, usersTable FROM Business INNER JOIN usersTable ON usersTable.userId = Business.ownerId WHERE ownerId = ?`;

  Pool.query(SelectAll, [userID])
    .then(([results]) => {
      if (results) {
        let Password = req.body.Password;
        let savedPassword = results[0].password;
        const isMatch = bcrypt.compareSync(Password, savedPassword);
        if (!isMatch) {
          res.json({ data: "wrong password" });
          return;
        }
        if (results.length > 0) {
          Pool.query(selectBusiness, [userID])
            .then(([result1]) => {
              let BusinessName = result1[0].BusinessName;
              let tables = [
                `${BusinessName}_expenses`,
                `${BusinessName}_Costs`,
                `${BusinessName}_products`,
                `${BusinessName}_Transaction`,
                BusinessName,
              ];
              return Pool.query(Drop, tables);
            })
            .then(([result2]) => {
              return Pool.query(deleteBusiness, [userID]);
            })
            .then(([response]) => {
              res.json({ data: "deleted data" });
            })
            .catch((error) => {
              console.error(error);
              res.json({ data: "error 90" });
            });
        } else {
          res.json({ data: results });
        }
      }
    })
    .catch((error) => {
      console.error(error);
      res.json({ data: "err 5.908" });
    });
  return;
  let Select = `select * from usersTable where userId='${userID}'`;
  connection.query(Select, (err, results) => {
    if (err) {
      res.json({ data: "err 5.908" });
    }
    if (results) {
      let Password = req.body.Password;
      let savedPassword = results[0].password;
      const isMatch = bcrypt.compareSync(Password, savedPassword);
      if (!isMatch) {
        res.json({ data: "wrong password" });
        return;
      }
      if (results.length > 0) {
        let selectBusiness = `select * from Business where ownerId=${userID}`;
        connection.query(selectBusiness, (err, result1) => {
          if (err) res.json({ data: "err 67" });
          else {
            // res.json({ data: result1 });
            // BusinessID: 1, BusinessName: 'waterBusiness'
            let BusinessName = result1[0].BusinessName,
              Drop = `DROP TABLE IF EXISTS ${BusinessName}_expenses,${BusinessName}_Costs,${BusinessName}_products,${BusinessName}_Transaction,${BusinessName}`;
            connection.query(Drop, (err, result2) => {
              if (err) res.json({ data: "error 90" });
              else {
                let deleteBusiness = `Delete   Business,userstable   FROM Business  INNER JOIN userstable   where ownerId=${userID} and userId=ownerId`;
                connection.query(deleteBusiness, (err, response) => {
                  if (err) {
                    console.log(err);
                    res.json({ data: "error 456" });
                  }
                  if (response) {
                    res.json({ data: "deleted data" });
                  }
                });
              }
            });
          }
        });
      } else res.json({ data: results });
    }
  });
});
server.post(path + "/updateCostData/", async (req, res) => {
  let businessName = req.body.businessName,
    Token = req.body.Token,
    CostName_ = req.body.CostName_,
    CostValue_ = req.body.CostValue_,
    costsId = req.body.costsId;
  const sanitizedBusinessName = Pool.escape(businessName + "_Costs");
  const sanitizedCostName = Pool.escape(CostName_);
  const sanitizedUnitCost = Pool.escape(CostValue_);
  const sanitizedCostsId = Pool.escape(costsId);

  const updateQuery = `UPDATE ${sanitizedBusinessName} SET costName=${sanitizedCostName}, unitCost=${sanitizedUnitCost} WHERE costsId=${sanitizedCostsId}`;

  Pool.query(updateQuery)
    .then((results) => {
      res.json({ data: "updated successfully", results });
    })
    .catch((error) => {
      res.json({ data: error });
    });
});
server.post(path + "updateMyexpencesList/", async (req, res) => {
  // ExpId: 1;
  // amount: "900";
  // businessName: "waterBusiness";
  // description: "8989";
  const businessName = req.body.businessName;
  const description = req.body.description;
  const amount = req.body.amount;
  const ExpId = req.body.ExpId;
  const query =
    "UPDATE ?? SET costDescription = ?, costAmount = ? WHERE expenseId = ?";
  const table = `${businessName}_expenses`;
  const values = [table, description, amount, ExpId];

  Pool.query(query, values)
    .then(([rows]) => {
      console.log(`Updated ${rows.affectedRows} row(s)`);
      res.json({ data: "updated" });
    })
    .catch((error) => {
      console.error(error);
      res.json({ data: "err 501.1" });
    });
  // return;
  // let businessName = req.body.businessName,
  //   description = req.body.description,
  //   amount = req.body.amount,
  //   ExpId = req.body.ExpId,
  //   exp = `update ${businessName}_expenses set costDescription='${description}',costAmount='${amount}' where expenseId='${ExpId}'`;
  // connection.query(exp, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //     res.json({ data: "err 501.1" });
  //   }
  //   if (results) {
  //     console.log(results);
  //     res.json({ data: "updated" });
  //   }
  // });
});

server.post(path + "deleteSales_purchase/", async (req, res) => {
  const transactionId = req.body.items.transactionId;
  const businessName = req.body.items.businessName;
  // console.log(req.body.items);
  // businessName:
  // return;
  const x = await Auth(req.body.items.token);
  const Delet = "DELETE FROM ?? WHERE transactionId = ?";
  const table = `${businessName}_Transaction`;
  const DeletValues = [table, transactionId];
  // ownerId;BusinessName;
  console.log("x is ", x);
  // return;
  const verify =
    "SELECT * FROM Business WHERE BusinessName = ? AND ownerId = ?";
  const verifyValues = [businessName, x];

  Pool.query(verify, verifyValues)
    .then(([rows]) => {
      if (rows.length > 0 && rows[0].BusinessName === businessName) {
        return Pool.query(Delet, DeletValues).then((results) => {
          return res.json({ data: "deleted", results });
        });
      } else {
        return res.json({ data: "NotAllowedByYou" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.json({ data: "err 501.1" });
    });
  return;
  // let transactionId = req.body.items.transactionId;
  // let businessName = req.body.items.businessName;
  // console.log(req.body.items);
  // // businessName:
  // // return;
  // let x = await Auth(req.body.items.token);
  // let Delet = `delete from ${businessName}_Transaction where transactionId=${transactionId}`;
  // // ownerId;BusinessName;
  // console.log("x is ", x);
  // // return;
  // let verify = `select * from Business where BusinessName='${businessName}' and ownerId='${x}' `;
  // connection.query(verify, (err, responce) => {
  //   if (err) {
  //     console.log(err);
  //     return res.json({ data: err, err });
  //   } else {
  //     if (responce.length > 0)
  //       if (responce[0].BusinessName == req.body.items.businessName) {
  //         // res.json({ data: responce });
  //         connection.query(Delet, (err, results) => {
  //           if (err) {
  //             console.log(err);
  //             return res.json({ data: err, err });
  //           } else {
  //             return res.json({ data: "deleted", results });
  //           }
  //         });
  //       } else res.json({ data: "NotAllowedByYou" });
  //     return;
  //   }
  // });
});
server.post(path + "deleteCostData", async (req, res) => {
  // businessName: "waterBusiness";
  // costName: "taxi";
  // costsId: 1;
  // // unitCost: 100;
  const businessName = req.body.businessName;
  const costsId = req.body.costsId;
  const Token = req.body.Token;
  const userId = await Auth(Token);
  const select =
    "SELECT * FROM Business WHERE BusinessName = ? AND ownerId = ?";
  const selectValues = [businessName, userId];

  Pool.query(select, selectValues)
    .then((responce) => {
      if (responce.length > 0) {
        const deleteCostItem = "DELETE FROM ?? WHERE costsId = ?";
        const table = `${businessName}_Costs`;
        const deleteCostItemValues = [table, costsId];
        return Pool.query(deleteCostItem, deleteCostItemValues).then(
          (results) => {
            return res.json({ data: "deleted" });
          }
        );
      } else {
        return res.json({ data: "youAreNotAllowed" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.json({ data: "err 501.1" });
    });
  // let businessName = req.body.businessName,
  //   costsId = req.body.costsId,
  //   Token = req.body.Token;
  // let userId = await Auth(Token);
  // let select = `select * from Business where BusinessName= '${businessName}' and ownerId ='${userId}'`;
  // connection.query(select, (err, responce) => {
  //   if (err) console.log(err);
  //   if (responce.length > 0) {
  //     let deleteCostItem = `delete from ${businessName}_Costs where costsId='${costsId}'`;
  //     connection.query(deleteCostItem, (err, results) => {
  //       if (err) console.log(err);
  //       if (results) {
  //         res.json({ data: "deleted" });
  //       }
  //       console.log(results);
  //     });
  //   } else {
  //     res.json({ data: "youAreNotAllowed" });
  //   }
  // });
});
server.post(path + "GetMinimumQty/", (req, res) => {
  const token = req.body.token;
  const businessName = req.body.businessName;
  const select = `SELECT * FROM ??, ?? WHERE productIDTransaction = ProductId ORDER BY registeredTime DESC LIMIT 1`;
  const table = `${businessName}_`;

  Pool.query(select, [table + "Transaction", table + "products"])
    .then(([rows]) => {
      return res.json({ data: rows });
      console.log("@GetMinimumQty ", rows);
    })
    .catch((error) => {
      console.log(error);
      res.json({ data: "err", error });
    });
  // let token = req.body.token,
  //   businessName = req.body.businessName,
  //   select = `select * from ${businessName}_Transaction,${businessName}_products where productIDTransaction=ProductId order by registeredTime desc limit 1`;

  // connection.query(select, (err, results) => {
  //   if (err) {
  //     console.log(err);

  //     res.json({ data: "err", err });
  //   }
  //   if (results) {
  //     res.json({ data: results });
  //     console.log("@GetMinimumQty ", results);
  //   }
  // });
  // res.json({ data: req.body });
});
server.post(path + "getMaximumSales/", (req, res) => {
  let DateRange = req.body.DateRange,
    fromDate = DateRange.fromDate,
    toDate = DateRange.toDate,
    businessName = req.body.businessName,
    token = req.body.token;
  // let select = `select * from ${businessName}_products, ${businessName}_Transaction where  ProductId = productIDTransaction and registeredTime between '${toDate}' and '${fromDate}'`;
  const table1 = `${businessName}_products`;
  const table2 = `${businessName}_Transaction`;

  const select = `SELECT *
                FROM ??, ??
                WHERE ProductId = productIDTransaction
                AND registeredTime BETWEEN ? AND ?`;

  const values = [table1, table2, fromDate, toDate];

  Pool.query(select, values)
    .then(([rows]) => {
      if (rows) {
        console.log(rows);
        return res.json({ data: rows });
      }
    })
    .catch((error) => {
      res.json({ data: error });
    });
});
server.post(path + "removeEmployeersBusiness/", async (req, res) => {
  const userID = await Auth(req.body.token);
  const getEmployeerBusiness = `SELECT * FROM employeeTable WHERE userIdInEmployee = ? AND BusinessIDEmployee = ?`;
  const getEmployeerBusinessValues = [userID, req.body.BusinessID];

  Pool.query(getEmployeerBusiness, getEmployeerBusinessValues)
    .then((results) => {
      if (results.length > 0) {
        const deleteData = `DELETE FROM employeeTable WHERE userIdInEmployee = ? AND BusinessIDEmployee = ?`;
        const deleteDataValues = [userID, req.body.BusinessID];
        return Pool.query(deleteData, deleteDataValues)
          .then((resultsOfSelect) => {
            if (resultsOfSelect) {
              return res.json({ data: resultsOfSelect });
            } else {
              return res.json({ data: "alreadyDeleted" });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.json({ data: error });
          });
      } else {
        return res.json({ data: "NoDataLikeThis" });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.json({ data: error });
    });
  return;
  // return res.json({ data: req.body });
  // let userID = await Auth(req.body.token);
  // let getEmployeerBusiness = `select * from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
  // connection.query(getEmployeerBusiness, (err, results) => {
  //   if (err) console.log(err);
  //   // res.json({ data: results });
  //   if (results.length > 0) {
  //     let deleteData = `delete from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
  //     connection.query(deleteData, (error, resultsOfSelect) => {
  //       if (error) {
  //         console.log(error);
  //         return res.json({ data: error, error });
  //       }
  //       if (resultsOfSelect) {
  //         return res.json({ data: resultsOfSelect });
  //       } else return res.json({ data: "alreadyDeleted" });
  //     });
  //   } else {
  //     res.json({ data: "NoDataLikeThis" });
  //   }
  // });
});
server.post(path + "deleteProducts/", async (req, res) => {
  let businessName = req.body.businessName;
  let productId = req.body.ProductId;

  let deleteData = `DELETE FROM ?? WHERE ProductId = ?`;

  Pool.query(deleteData, [`${businessName}_products`, productId])
    .then(([rows]) => {
      res.status(200).json({ data: rows });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
server.post(path + "deleteExpencesItem", (req, res) => {
  // console.log('deleteExpencesItem')
  // return
  let sql = `DELETE FROM ?? WHERE expenseId = ?`;
  let params = [`${req.body.businessName}_expenses`, req.body.expenseId];

  Pool.query(sql, params)
    .then((result) => {
      res.status(200).json({ data: "deleteSuccess" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

server.post(path + "forgetRequest", (req, res) => {
  let phoneNumber = req.body.PhoneNumber;
  let sql = `SELECT * FROM usersTable WHERE phoneNumber = ?`;

  Pool.query(sql, [phoneNumber])
    .then(([rows]) => {
      if (rows.length > 0) {
        let Rand = Math.floor(Math.random() * 1000000);
        let updateForgetPassStatus = `UPDATE usersTable SET passwordStatus = 'requestedToReset', passwordResetPin = ? WHERE phoneNumber = ?`;

        Pool.query(updateForgetPassStatus, [Rand, phoneNumber])
          .then(() => {
            res.status(200).json({ data: "requestedToChangePassword" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        res.status(404).json({ error: "Phone number not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
server.post(path + "updateChangeInpassword/", (req, res) => {
  let phoneNumber = req.body.PhoneNumber;
  let password = req.body.Password.password;
  let retypedPassword = req.body.Password.retypedPassword;

  if (password !== retypedPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const salt = bcrypt.genSaltSync();
  const encryptedPassword = bcrypt.hashSync(password, salt);

  let update = `UPDATE usersTable SET password = ? WHERE phoneNumber = ?`;

  Pool.query(update, [encryptedPassword, phoneNumber])
    .then((result) => {
      if (result.affectedRows > 0) {
        res.status(200).json({ data: "passwordChanged" });
      } else {
        res.status(404).json({ data: "unableToMakeChange" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

server.post(path + "verifyPin", (req, res) => {
  let phone = req.body.PhoneNumber;
  let pincode = req.body.pincode;
  let select = `SELECT * FROM usersTable WHERE phoneNumber = ?`;

  Pool.query(select, [phone])
    .then(([rows]) => {
      if (rows.length > 0) {
        let pin = result[0].passwordResetPin;
        if (pincode === pin) {
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

server.get(path + "requestPasswordReset/", (req, res) => {
  let select = `SELECT * FROM usersTable WHERE passwordStatus = 'requestedToReset'`;
  Pool.query(select)
    .then(([rows]) => {
      let result = rows;
      if (rows.length > 0) {
        let userId = rows[0].userId;
        let update = `UPDATE usersTable SET passwordStatus = 'pinSentedToUser' WHERE userId = ?`;

        Pool.query(update, [userId])
          .then(([rows]) => {
            let phoneNumber = result[0].phoneNumber;
            let pinCode = result[0].passwordResetPin;
            res.json({ phoneNumber, pinCode });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        res.json({ phoneNumber: "notFound", pinCode: "notFound" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
// server.get(path + "requestPasswordReset/", (req, res) => {
//   console.log("requestPasswordReset", req);
//   let select = `select * from usersTable where passwordStatus='requestedToReset'`;
//   connection.query(select, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.json({ data: err });
//     }
//     if (result) {
//       console.log(result);
//       if (result.length > 0) {
//         // wait here

//         let update = `update usersTable set passwordStatus='pinSentedToUser' where userId='${result[0].userId}'`;
//         connection.query(update, (err, result1) => {
//           if (err) return res.json({ data: err, err });
//           console.log("result1", result1);
//           res.json({
//             phoneNumber: result[0].phoneNumber,
//             pinCode: result[0].passwordResetPin,
//           });
//         });
//       } else {
//         res.json({ phoneNumber: "notFound", pinCode: "notFound" });
//       }
//     }
//   });
// });
function validateAlphabet(reqData, res) {
  const regex = /^[a-zA-Z0-9_]+$/;
  const str = reqData; // Assumes the string to validate is in the `str` property of the request body

  if (!regex.test(str)) {
    return res.status(400).json({
      data: "wrongCharacter",
      message: "String must contain only letters from the alphabet (a-z)",
    });
  } else return "correctData";
}
