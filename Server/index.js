let cors = require("cors");
let express = require("express");
let bcrypt = require("bcryptjs");
let Auth = require("./Auth.js").Auth;
let dotenv = require("dotenv");
let sqlstring = require("sqlstring");
let mysql2 = require("mysql2");
let tokenKey = "shhhhh";
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

let Databases = require("./Database.js");
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
// //console.log("fullTime is " + fullTime);
Databases.createBasicTables();
let jwt = require("jsonwebtoken");
const { Pool } = require("./Database.js");
const { DateFormatter } = require("./DateFormatter.js");
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
    console.log(`connected at ${process.env.serverPort}`);
  }
});
server.post(path, (req, res) => {
  res.end(
    "<h1><center>This is server is running well in post methodes.</center></h1>"
  );
});
server.get(path, async (req, res) => {
  // return res.end(
  //   "<h1><center>This is server is running well in post methodes.</center></h1>"
  // );
  // alter tables creditPaymentDate
  // let daily = `ALTER TABLE dailyTransaction ADD COLUMN creditPaymentDate DATE DEFAULT NULL`;
  // Pool.query(daily)
  //   .then((responces) => {
  //     res.json({ data: responces });
  //   })
  //   .catch((eror) => {
  //     res.json({ data: eror });
  //   });
  // return;

  let select = "select * from Business ";
  let myData = [];
  await Pool.query(select)
    .then(([results]) => {
      //console.log("results", results);
      myData = results;
      results.map(async (data) => {
        let { BusinessName } = data;
        let editableTable = `ALTER TABLE  ${BusinessName}_Transaction
      ADD mainProductId INT after productIDTransaction`;
        await Pool.query(editableTable)
          .then((data1) => {
            console.log(data1);
          })
          .catch((error) => {
            console.log(error);
          });
        editableTable = `ALTER TABLE ${BusinessName}_Transaction
  MODIFY creditDueDate date , MODIFY salesTypeValues enum('On cash','By bank','On credit','Credit paied'), MODIFY creditPayementdate date`;
        Pool.query(editableTable)
          .then((data1) => {
            //console.log(data1);
          })
          .catch((error) => {
            //console.log(error);
          });
        // //console.log("data", data);
        // res.json({ data });
      });
    })
    .catch((error) => {
      //console.log(error);
    });
  // res.end(
  //   "<h1><center>This is server is running well in get methodes.</center></h1>"
  // );
  res.json({ data: myData });
});
server.post(path + "getBusiness/", (req, res) => {
  let tokens = req.body.token;

  if (!tokens) {
    return res.json({ data: "You haven't logged in before." });
  }

  try {
    let decoded = jwt.verify(tokens, tokenKey);
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
        //console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    //console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
});
server.post(path + "verifyLogin/", async (req, res) => {
  let token = req.body.token;
  try {
    let decoded = jwt.verify(token, tokenKey);
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
        //console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    //console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
});
server.post(path + "Login/", (req, res) => {
  //console.log(req.body);
  //console.log("req.body.phoneNumber", req.body.phoneNumber);

  let phoneNumber = req.body.phoneNumber;
  //console.log("phoneNumber", phoneNumber);

  let select = `SELECT * FROM usersTable WHERE phoneNumber = ? LIMIT 1`;

  Pool.query(select, [req.body.phoneNumber])
    .then(([rows]) => {
      if (rows.length == 0) {
        return res.json({ data: "data not found" });
      }

      let savedPassword = rows[0].password;
      const isMatch = bcrypt.compareSync(req.body.Password, savedPassword);
      let token = jwt.sign({ userID: rows[0].userId }, tokenKey);
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
      //console.error(err);
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

  // //console.log("results is " + results);
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
                //console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
              });
          } else {
            return res.json({ data: "productIsAlreadyAddedBefore" });
          }
        })
        .catch((err) => {
          //console.error(err);
          if (err.sqlState == `42S02`) {
            //console.log("please recreate tables again");
            createBusiness(businessName, userId, fullTime, res, "recreate");
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
    })
    .catch((err) => {
      //console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});
// i am here
server.post(path + "createBusiness/", (req, res) => {
  let businessName = req.body.businessName;
  let decoded = jwt.verify(req.body.token, tokenKey);
  let userID = decoded.userID;
  let response = createBusiness(businessName, userID, fullTime, res);
});
server.post(path + "getRegisteredProducts/", async (req, res) => {
  // //console.log(req.body.BusinessId, req.body.token, req.body.businessName);
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
      //console.log("in getRegisteredProducts", rows);
      res.json({ data: rows });
    })
    .catch((err) => {
      //console.error(err);
      res.json({ error: "Unable to fetch data." });
    });
});
server.post(path + "registerTransaction/", async (req, res) => {
  try {
    const rowData = req.body;
    // console.log("rowData", rowData.ProductsList);
    let businessName = rowData.businessName;
    const validate = validateAlphabet(businessName, res);

    if (validate === "correctData") {
      const productsList = rowData.ProductsList;
      const length = productsList.length;
      const insertableProducts = [];
      const inventoryList = [];
      for (let i = 0; i < length; i++) {
        let product = productsList[i],
          productID = product.ProductId,
          previousProductId = productsList[i].previousProductId,
          salesQuantity = rowData[`salesQuantity${productID}`],
          salesTypeValues = rowData[`salesTypeValues${productID}`],
          creditDueDate = rowData.creditDueDate,
          purchaseQty = rowData[`purchaseQty${productID}`],
          creditSalesQty = rowData[`creditSalesQty${productID}`],
          wrickageQty = rowData[`wrickageQty${productID}`],
          description = rowData[`Description${productID}`];
        if (previousProductId == null || previousProductId == "null") {
          previousProductId = productID;
        }
        if (creditSalesQty == null || creditSalesQty == "null") {
          creditSalesQty = 0;
        }
        //Select to check if item is registered in this day
        const selectToCheck = `SELECT * FROM ?? WHERE registeredTime LIKE ? AND productIDTransaction = ?`;
        const table = `${businessName}_Transaction`;
        const valuesOfTransactions = [table, `%${rowData.dates}%`, productID];
        const [rows] = await Pool.query(selectToCheck, valuesOfTransactions);
        if (rows.length > 0) {
          // If the product is already registered
          continue;
        } else {
          // Get previous inventory
          const prevInventoryQuery =
            "SELECT * FROM ?? WHERE productIDTransaction = ? AND registeredTime <= ? ORDER BY registeredTime DESC LIMIT 1";
          const prevInventoryTable = `${businessName}_Transaction`;
          const prevInventoryValues = [
            prevInventoryTable,
            previousProductId,
            rowData.dates,
          ];

          const [prevInventoryRows] = await Pool.query(
            prevInventoryQuery,
            prevInventoryValues
          );

          let Inventory = 0;
          if (prevInventoryRows.length > 0) {
            Inventory = prevInventoryRows[0].Inventory;
          }
          // console.log("prevInventoryQuery", prevInventoryQuery);
          // console.log("prevInventoryValues", prevInventoryValues);

          Inventory +=
            Number(purchaseQty) -
            Number(salesQuantity) -
            Number(wrickageQty) -
            Number(creditSalesQty);
          //////////////// it is fine and good /////////////////
          inventoryList.push(Inventory);
          const insertQuery = `INSERT INTO ${businessName}_Transaction(description, unitCost, unitPrice, productIDTransaction, mainProductId, salesQty, purchaseQty, registeredTime, wrickages, Inventory,creditDueDate,salesTypeValues,creditSalesQty) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          let Values = [
            description,
            product.productsUnitCost,
            product.productsUnitPrice,
            productID,
            previousProductId,
            salesQuantity,
            purchaseQty,
            rowData.dates,
            wrickageQty,
            Inventory,
            creditDueDate,
            salesTypeValues,
            creditSalesQty,
          ];

          await Pool.query(insertQuery, Values);
          const insertedProduct = {
            previousProductId,
            creditSalesQty: creditSalesQty,
            creditDueDate: creditDueDate,
            salesTypeValues: salesTypeValues,
            Description: description,
            productsUnitCost: product.productsUnitCost,
            productsUnitPrice: product.productsUnitPrice,
            ProductId: productID,
            salesQuantity: salesQuantity,
            purchaseQty: purchaseQty,
            wrickageQty: wrickageQty,
            Inventory:
              parseFloat(purchaseQty) -
              parseFloat(salesQuantity) -
              parseFloat(wrickageQty) -
              parseFloat(creditSalesQty),
          };
          insertableProducts.push(insertedProduct);
        }
      }

      if (insertableProducts.length === 0) {
        return res.json({
          data: "allDataAreRegisteredBefore",
          previouslyRegisteredData: [],
          date: rowData.dates,
          values: "",
        });
      }

      updateNextDateInventory(
        `${businessName}_Transaction`,
        insertableProducts,
        rowData.dates,
        inventoryList
      );

      return res.json({
        data: "data is registered successfully",
        previouslyRegisteredData: [],

        dataToSendResponceToClient: "NoNeed",
      });
    } else {
      // Invalid business name
      return res.json({
        data: "This data contains a string, please use a-z and numbers only",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.json({ data: "error", error });
  }
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

  // //console.log("select is select", select);
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
  // //console.log("@updateTransactions", req.body);
  // return;
  let currentInventory = "",
    prevInventory = "";
  let previousDay = await getPreviousDay(new Date(req.body.date));
  let validate = validateAlphabet(req.body.businessName, res),
    businessName = "";
  // //console.log("validate", validate);
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let productId = req.body.productId;
  const selectQuery = `SELECT * FROM ?? WHERE registeredTime <=? AND productIDTransaction = ?  order by registeredTime desc limit 1 `;
  const params = [`${businessName}_Transaction`, previousDay, productId];
  Pool.query(selectQuery, params)
    .then(([rows]) => {
      //console.log("result on selectQuery ", rows, "previousDay", previousDay);
      return rows;
    })
    .then((data) => {
      // return;
      currentInventory =
        parseInt(req.body.purchaseQty) -
        parseInt(req.body.salesQty) -
        parseInt(req.body.wrickages);
      if (data.length > 0) {
        prevInventory = parseInt(data[0].Inventory);
        currentInventory += prevInventory;
      }
      //console.log(
      //   "prevInventory",
      //   prevInventory,
      //   "currentInventory",
      //   currentInventory
      // );
      // return;
      const updateQuery = `UPDATE ?? SET wrickages=?, purchaseQty=?, salesQty=?, Inventory=?, description=? WHERE transactionId=?`;
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
          //console.log("results on updateQuery======", results);

          const sqlToSelect = `SELECT * FROM ?? t, ?? p  WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? and ? order by  t.registeredTime desc`;
          // define the input data as an array of values
          const inputToSelect = [
            `${businessName}_Transaction`,
            `${businessName}_products`,
            req.body.fromDate,
            req.body.toDate,
          ];
          let dataToSendResponceToClient = { sqlToSelect, inputToSelect, res };
          // execute the query with the input data
          Pool.query(sqlToSelect, inputToSelect)
            .then(([rows]) => {
              rows.map(async (item) => {
                if (req.body.transactionId == item.transactionId) {
                  // //console.log("item.registeredTime", item.registeredTime);
                  await updateNextDateInventory(
                    `${businessName}_Transaction`,
                    [item],
                    DateFormatter(item.registeredTime),
                    [currentInventory],
                    dataToSendResponceToClient
                  );
                  // res.json({ data: rows });
                }
              });
            })
            .catch((error) => {
              //console.log("error in alltransaction", error);
              res.json({ data: error, error: "621" });
            });
        })
        .catch((error) => {
          res.json({ data: "error", error });
        });
    })
    .catch((error) => {
      //console.log("error", error);
      res.json({ data: error, error });
    });
});
async function getPreviousDay(date) {
  // Get the current date
  const currentDate = new Date(date);
  // Subtract one day from the current date
  const previousDate = new Date();
  previousDate.setDate(currentDate.getDate() - 1);

  // Extract the year, month, and day from the previous date
  const year = previousDate.getFullYear();
  const month = previousDate.getMonth() + 1; // Month is zero-based, so add 1
  const day = previousDate.getDate();

  // Format the date components as a string (YYYY-MM-DD)
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  //console.log("Previous day:", formattedDate);
  return formattedDate;
}

server.post(path + "searchProducts/", async (req, res) => {
  let businessName = "",
    productName = req.body.InputValue.productName,
    toDate = req.body.InputValue.toDate,
    fromDate = req.body.InputValue.fromDate,
    selectSearches = req.body.InputValue.selectSearches;
  // //console.log( businessName,toDate, fromDate, " = selectSearches = " + selectSearches  );
  let validate = validateAlphabet(req.body.businessName, res);
  if (validate == "correctData") {
    businessName = req.body.InputValue.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  if (selectSearches == "PRODUCTS") {
    let selectProducts = `select * from ?? where Status='active'`;
    let tableName = `${businessName}_products`;
    Pool.query(selectProducts, [tableName])
      .then(([rows]) => {
        console.log("Selected PRODUCTS=", rows);
        res.json({ data: "no results", products: rows });
      })
      .catch((Error) => {
        console.log("Error", Error);
        res.json({ Error });
      });
  } else if (selectSearches == "TRANSACTION") {
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
    //console.log("in ALLTRANSACTION req.body == ", req.body);
    const sql = `SELECT * FROM ?? t, ?? p  WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? AND ? order by t.registeredTime desc`;
    // define the input data as an array of values
    const input = [
      `${businessName}_Transaction`,
      `${businessName}_products`,
      fromDate,
      toDate,
    ];
    let data = "";
    // execute the query with the input data
    // collected money in some date range from total sales
    // this sql is used to collect data where money is collected in some date range. This is from total sales but not from single sales
    let selectAccountRecived = `SELECT * FROM ?? t, ?? p  WHERE t.productIDTransaction = p.ProductId AND t.creditPayementdate BETWEEN ? AND ? order by t.creditPayementdate desc`;
    let CollectedMoneyFromTotalSales = [];
    await Pool.query(selectAccountRecived, input)
      .then(([rows]) => {
        CollectedMoneyFromTotalSales = rows;
      })
      .catch((error) => {
        //console.log(error);
      });
    await Pool.query(sql, input)
      .then(([rows]) => {
        data = rows;
        //console.log("data in all", rows);
        const sql = `SELECT * FROM ?? e, ?? c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
        // define the input data as an array of values
        const inputExp = [
          `${businessName}_expenses`,
          `${businessName}_Costs`,
          fromDate,
          toDate,
        ];

        // execute the query with the input data
        Pool.query(sql, inputExp)
          .then(([rows]) => {
            res.json({
              expenceTransaction: rows,
              data,
              CollectedMoneyFromTotalSales,
            });
          })
          .catch((error) => {
            res.json({ err: error });
          });
      })
      .catch((error) => {
        //console.log("error in alltransaction", error);
        res.json({ data: error, error: "9090" });
      });
  } else if (selectSearches == "COSTS") {
    //console.log("in cost req.body==", req.body);
    let selectCost = `select * from??`;
    let costValues = `${businessName}_Costs`;
    Pool.query(selectCost, costValues)
      .then(([rows]) => {
        return res.json({ data: rows });
      })
      .catch((error) => {
        //console.log("err is", error);
        return res.json({ data: "error 678" });
      });
  } else {
    res.json({ data: "Bad request.", products: "Bad request", selectSearches });
  }
});
/////////////////// Good and Good items //////////////////////////
server.post(path + "updateProducts/", async (req, res) => {
  console.log(req.body);
  //in updating process we don't need to delete previous products data instade we keep history
  let productPriceCurrent = req.body.productPrice,
    productNameCurrent = req.body.productName,
    productCostCurrent = req.body.productCost,
    businessName = req.body.businessName,
    idCurrent = req.body.id,
    minimumQtyCurrent = req.body.minimumQty;
  // define the SQL query using placeholders
  let select = `select * from  ${businessName}_products where  ProductId = ${idCurrent}`;
  let [selectResult] = await Pool.query(select);
  console.log("selectResult", selectResult);
  let { productsUnitCost, productsUnitPrice, productName, minimumQty } =
    selectResult[0];
  let selectFirstId = `select * from  ${businessName}_products where  ProductId = ${idCurrent}`;
  let [Responces] = await Pool.query(selectFirstId);
  let { initialProductId, ProductId } = Responces[0];
  if (initialProductId == null) initialProductId = ProductId;
  console.log("initialProductId", initialProductId);
  // return;
  const sql = `UPDATE ${businessName}_products SET status='changed'  WHERE ProductId = ${idCurrent}`;
  const insertQuery = `INSERT INTO ${businessName}_products (productsUnitCost, productsUnitPrice, productName, minimumQty, previousProductId, prevUnitCost,prevUnitPrice, prevProductName, prevMinimumQty, Status)VALUES (?,?,?,?,?,?,?,?,?,?)`;
  const values = [
    productCostCurrent,
    productPriceCurrent,
    productNameCurrent,
    minimumQtyCurrent,
    initialProductId,
    productsUnitCost,
    productsUnitPrice,
    productName,
    minimumQty,
    "active",
  ];
  console.log("insertQuery", insertQuery);
  console.log("values", values);
  // return;
  try {
    const result = await Pool.query(insertQuery, values);
    console.log("Data", result.rows);
  } catch (error) {
    console.log("Error", error);
  }
  // define the input data as an array of values
  // execute the query with the input data
  let x = await Pool.query(sql)
    .then(([results]) => {
      res.json({ data: "updated well", results, sql });
    })
    .catch((error) => {
      res.json({ err: error });
    });
});
server.post(path + "AddCostItems/", async (req, res) => {
  // //console.log(req.body);
  let myId = await Auth(req.body.token);
  const sql = "SELECT * FROM Business WHERE BusinessName = ? AND ownerId = ?";
  // define the input data as an array of values
  const input = [req.body.businessName, myId];
  // execute the query with the input data
  Pool.query(sql, input)
    .then(([rows]) => {
      // connection.query(select, (err, result) => {

      //console.log("result is ===", rows);
      if (rows.length > 0) {
        insertIntoCosts(`${req.body.businessName}_Costs`, req.body, res);
        return;
      }
      res.json({ data: "notallowedToU" });
    })
    .catch((error) => {
      //console.log(err);
      return res.json({ data: "err", error });
    });
});
server.post(path + "getCostLists/", (req, res) => {
  // //console.log(req.body);
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
      //console.log("line 458", rows);
      res.json({
        data: rows,
      });
      //// //console.log(businessName);
    })
    .catch((error) => {
      res.json({ data: "err", err: error });
    });
});
server.post(`/registerCostTransaction/`, (req, res) => {
  // //console.log("in registerCostTransaction = ", req.body.costData[0].costsId);
  // return;
  let costData = req.body.costData,
    date = req.body.costDate,
    rowData = req.body;
  // define the SQL query using placeholders for the table name and date parameter
  const sql = "SELECT * FROM ?? WHERE costRegisteredDate = ? and costId=?";
  let costId = req.body.costData[0].costsId;
  // define the input data as an array of values
  const input = [`${req.body.businessName}_expenses`, date, costId];
  //console.log("date is ", date);
  // execute the query with the input data
  // return;
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
          // //console
          // .log("inserted values are ", values)
          .then((results) => {
            res.json({ data: "Inserted properly" });
          })
          .catch((error) => {
            //console.log("error", error);
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
      //console.log(result);
      // Return a success message in the response JSON
      res.json({
        data: "updated well",
      });
    })
    .catch((err) => {
      // Handle any errors
      //console.error("MySQL error:", err);
      res.json({ err });
    });
});

const updateNextDateInventory = async (
  businessName,
  ProductsList,
  date,
  previousInventory,
  dataToSendResponceToClient
) => {
  // console.log(
  //   "businessName",
  //   businessName,
  //   "ProductsList",
  //   ProductsList,
  //   "date",
  //   date,
  //   "previousInventory",
  //   previousInventory,
  //   "dataToSendResponceToClient",
  //   dataToSendResponceToClient
  // );
  // return;
  let sqlToSelect, inputToSelect, res;

  function sendResponses() {
    if (
      typeof dataToSendResponceToClient == "object" &&
      dataToSendResponceToClient !== "NoNeed"
    ) {
      sqlToSelect = dataToSendResponceToClient.sqlToSelect;
      inputToSelect = dataToSendResponceToClient.inputToSelect;
      res = dataToSendResponceToClient.res;

      Pool.query(sqlToSelect, inputToSelect).then(([rows]) => {
        return res.json({ data: rows });
      });
    }
  }

  //console.log("903 =", businessName, ProductsList, date, previousInventory);

  let index = 0;

  let recursiveUpdate = async () => {
    if (index < ProductsList.length) {
      let { productId, previousProductId } = ProductsList[index];
      console.log("first");

      if (previousProductId == null || previousProductId == "null")
        previousProductId = productId;
      //////11111111
      let select = `SELECT * FROM ?? WHERE mainProductId=? AND registeredTime > ? ORDER BY registeredTime ASC`;
      let values = [businessName, previousProductId, date];
      try {
        const [rows] = await Pool.query(select, values);
        //console.log("my rows ===", rows);

        if (rows.length > 0) {
          let prevInventory = 0;

          for (let i = 0; i < rows.length; i++) {
            let salesQty = rows[i].salesQty,
              purchaseQty = rows[i].purchaseQty,
              wrickages = rows[i].wrickages,
              creditsalesQty = rows[i].creditsalesQty,
              inventory =
                purchaseQty +
                (i === 0 ? previousInventory[index] : prevInventory) -
                salesQty -
                creditsalesQty -
                wrickages;
            prevInventory = inventory;

            let update = `UPDATE ?? SET inventory=? WHERE transactionId=?`;
            let valuesToUpdate = [
              businessName,
              inventory,
              rows[i].transactionId,
            ];

            //console.log("here it is ok it is ....");
            try {
              await Pool.query(update, valuesToUpdate).then((results) => {
                //console.log("results", results);
                if (i >= rows.length - 1) {
                  sendResponses();
                }
              });
            } catch (error) {
              //console.log(err);
              return res.json({ err: error });
            }
          }
        } else {
          sendResponses();
        }

        index++;
        recursiveUpdate(); // Call the recursive function to process the next product
      } catch (error) {
        //console.log(error);
      }
    } else {
      sendResponses(); // All products have been processed, send the responses
    }
  };

  recursiveUpdate();
};

// Usage

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
        return res.json({ data: "reservedByOtherBusiness", rows });
      } else {
        let oldBusinessName = "";
        let getOldtableName = `select * from Business where businessId=?`,
          v = targetBusinessId;

        Pool.query(getOldtableName, [v])
          .then(([rows]) => {
            if (rows) {
              // //console.log(results);
              oldBusinessName = rows[0].BusinessName;
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
                .then(([results]) => {
                  //console.log("Update successful:", results);
                  // Do something else
                })
                .catch((error) => {
                  //console.error("An error occurred:", error);
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
                  //console.log("Table _expenses renamed successfully");
                  // Do something else
                })
                .catch((error) => {
                  //console.error("An error occurred:", error);
                  // Handle the error
                });

              // let alter_transaction = `ALTER TABLE ${oldBusinessName}_Transaction RENAME TO ${businessName}_Transaction`;
              // connection.query(alter_transaction, (err, result) => {
              //   if (err) return res.json({ err });
              //   if (result) //console.log(result);
              // });
              const query_Transaction = "ALTER TABLE ?? RENAME TO ??";
              const values_Transaction = [
                `${oldBusinessName}_Transaction`,
                `${businessName}_Transaction`,
              ];

              Pool.query(query_Transaction, values_Transaction)
                .then(() => {
                  //console.log("Table query_Transaction renamed successfully");
                  // Do something else
                })
                .catch((error) => {
                  //console.error("An error occurred:", error);
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
                  //console.log("Table query_Costs renamed successfully");
                  // Do something else
                  res.json({ data: "update is successfull" });
                })
                .catch((error) => {
                  //console.error("An error occurred:", error);
                  // Handle the error
                });
              // connection.query(alter_Costs, (err, result) => {
              //   if (err) {
              //     //console.log(err);
              //     return res.json({ err });
              //   }
              //   if (result) {
              //     //console.log(result);
              //   }

              //   let update = `update Business set businessName='${businessName}' where businessId='${targetBusinessId}'`;
              //   // { businessname: 'waterBusiness', targetBusinessId: 37 }

              //   connection.query(update, (err, result) => {
              //     if (err) {
              //       //console.log(err);
              //       return res.json({ err });
              //     }
              //     if (result) {
              //       // //console.log(result);
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
      //console.error("An error occurred:", error);
      // Handle the error
    });
  // return;
  // let veifyName = `select * from Business where businessName='${businessName}' and  businessId!='${targetBusinessId}'`;
  // //console.log("Pool is == ", Pool);
  // Pool.execute(veifyName)
  //   .then((results) => {
  //     //console.log("results ===", results);
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
          //console.error("An error occurred:", error);
        });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      // Handle the error
    });
});
server.post(path + "addEmployee/", async (req, res) => {
  let rowData = req.body,
    name = rowData.name,
    phone = rowData.phone,
    businessId = rowData.businessId,
    userId = rowData.userId;
  // //console.log("rowData is ");
  // //console.log(rowData);
  let employerId = await Auth(req.body.storeToken);
  // return;
  // let check = `select * from employeeTable,Business where userIdInEmployee=${userId} and BusinessID=${businessId} and BusinessIDEmployee=BusinessID`;
  const query =
    "SELECT * FROM employeeTable INNER JOIN Business ON BusinessIDEmployee = BusinessID WHERE userIdInEmployee = ? AND BusinessID = ?";
  const values = [userId, businessId];
  Pool.query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      // Do something else
      if (rows.length > 0) {
        res.json({ data: "data is already registered bofore" });
      } else {
        const query1 =
          "INSERT INTO employeeTable (userIdInEmployee, BusinessIDEmployee, employerId) VALUES (?, ?, ?)";
        const values1 = [userId, businessId, employerId];

        Pool.query(query1, values1)
          .then(([result]) => {
            //console.log("Insert successful:", result);
            // Do something else
            res.json({ data: "data is inserted correctly." });
          })
          .catch((error) => {
            //console.error("An error occurred:", error);
            // Handle the error
          });
        return;
        let insert = `insert into employeeTable(userIdInEmployee,BusinessIDEmployee,employerId)values('${userId}','${businessId}','${employerId}')`;
        connection.query(insert, (err, result) => {
          if (err) return res.json({ data: err, err });
          if (result) {
            //
            // //console.log(result);
          }
        });
      }
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      return res.json({ err });
      // Handle the error
    });
});
server.post(path + "getBusinessEmployee/", (req, res) => {
  // //console.log(req.body);
  //console.log("req.body.businessId " + req.body.businessId);
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
      //console.log(rows);
      // Do something else
      res.json({ data: rows });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      // Handle the error
      res.json({ data: "Error", error: "error to get employees" });
    });
});
server.post(path + "removeEmployees/", (req, res) => {
  // //console.log(req.body);
  const query = "DELETE FROM employeeTable WHERE employeeId = ?";
  const values = [req.body.employeeId];

  Pool.query(query, values)
    .then(([result]) => {
      //console.log("Delete successful:", result);
      // Do something else
      res.json({ Status: "deleted", EmployeeId: req.body.employeeId });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
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

    // //console.log(results);
  });
});
server.post(path + "registerEmployeersProducts/", (req, res) => {
  let TranactionProducts = req.body.tranactionProducts,
    EmployeersProduct = req.body.EmployeersProduct;
  // //console.log("TranactionProducts = ", TranactionProducts,    "EmployeersProduct = ",  EmployeersProduct );
  let ProductId = EmployeersProduct[0].ProductId;
  //  { purchase_1: '456', sales_1: '400', Wrickage_1: '6' }
  let purchase_ = "purchase_" + ProductId,
    sales_ = "sales_" + ProductId,
    Wrickage_ = "Wrickage_" + ProductId;
  // //console.log("EmployeersProduct[0]", EmployeersProduct[0]);
  // //console.log();
  let purchaseQty = TranactionProducts[purchase_],
    salesQty = TranactionProducts[sales_],
    wrickageQty = TranactionProducts[Wrickage_];
  // //console.log(purchaseQty, salesQty, wrickageQty);
  res.json({ data: req.body });
});
server.post(path + "getsingleProducts/", (req, res) => {
  let businessName = req.body.businessName,
    productName = req.body.searchInput;
  const query = `SELECT * FROM ?? WHERE productName LIKE ? and Status=?`;
  const values = [
    `${businessName}_products`,
    "%" + productName + "%",
    "active",
  ];
  //console.log("values==", values, "query==", query);
  Pool.query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      // Do something else
      res.json({ data: rows });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      res.json({ data: "error 400" });
      // Handle the error
    });
});
server.post(path + "registerSinglesalesTransaction/", (req, res) => {
  const {
    Description,
    brokenQty,
    businessId,
    purchaseQty,
    salesQty,
    ProductId,
    currentDate,
    salesType,
    creditPaymentDate,
    items,
  } = req.body;
  //console.log("salesType", salesType);
  let salesAmount = "salesQty";
  if (salesType == "On credit") {
    salesAmount = "creditsalesQty";
  }
  // salesTypeValues; creditPaymentDate
  const query = `INSERT INTO dailyTransaction (purchaseQty, ${salesAmount},salesTypeValues,creditPaymentDate,businessId, ProductId, brokenQty, Description, registrationDate,itemDetailInfo) VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?)`;
  const values = [
    purchaseQty,
    salesQty,
    salesType,
    creditPaymentDate,
    businessId,
    ProductId,
    brokenQty,
    Description,
    currentDate,
    JSON.stringify(items),
  ];

  Pool.query(query, values)
    .then(([result]) => {
      //console.log(`Inserted ${result.affectedRows} row(s)`);
      // Do something else
      res.json({ data: "successfullyRegistered" });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      res.json({ data: "err", err: error });
      // Handle the error
    });
  // return;

  let Insert = `insert into dailyTransaction(purchaseQty,salesQty,businessId,ProductId,brokenQty,Description,registrationDate)value('${purchaseQty}','${salesQty}','${businessId}','${ProductId}','${brokenQty}','${Description}','${currentDate}')`;

  // connection.query(Insert, (error, results) => {
  //   if (error) {
  //     // //console.log(error);
  //   }
  //   if (results) {
  //     res.json({ data: "successfullyRegistered" });
  //   }
  // });
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
    AND dt.registrationDate = ?  `;
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
    AND dt.registrationDate = ? `;
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
      //console.log(rows);
      // Do something else
      res.json({ data: rows, getTransaction });
    })
    .catch((error) => {
      //console.error("An error occurred:", error);
      // Handle the error
    });
});
server.post(path + "deleteBusines/", async (req, res) => {
  deleteBusiness(req.body.businessId, req.body.businessName, res);
});
server.post(path + "getMyProfile/", async (req, res) => {
  let userId = await Auth(req.body.myToken);
  //console.log("userId", userId);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userId];
  Pool.query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      res.json({ data: rows });
    })
    .catch((error) => {
      res.json({ data: "error No 5" });
      //console.error("An error occurred:", error);
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
  // //console.log("Encripted", Encripted);
  let userID = await Auth(myToken);
  const query = `SELECT * FROM usersTable WHERE userId = ?`;
  const values = [userID];

  Pool.query(query, values)
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

        Pool.query(query, values)
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

server.post(path + "deleteUsers/", async (req, res) => {
  let userID = await Auth(req.body.storeToken);
  //console.log("myId", userID);
  // //console.log(res.json({ data: myId }));

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
              //console.error(error);
              res.json({ data: "error 90" });
            });
        } else {
          res.json({ data: results });
        }
      }
    })
    .catch((error) => {
      //console.error(error);
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
                    //console.log(err);
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
    CostName_ = req.body.CostName_,
    costsId = req.body.costsId;

  const updateQuery = `UPDATE ?? SET costName=? WHERE costsId=?`;
  let values = [businessName + "_Costs", CostName_, costsId];
  Pool.query(updateQuery, values)
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
      //console.log(`Updated ${rows.affectedRows} row(s)`);
      res.json({ data: "updated" });
    })
    .catch((error) => {
      //console.error(error);
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
  //     //console.log(err);
  //     res.json({ data: "err 501.1" });
  //   }
  //   if (results) {
  //     //console.log(results);
  //     res.json({ data: "updated" });
  //   }
  // });
});

server.post(path + "deleteSales_purchase/", async (req, res) => {
  const transactionId = req.body.items.transactionId;
  const businessName = req.body.items.businessName;
  // //console.log(req.body.items);
  // businessName:
  // return;
  const x = await Auth(req.body.items.token);
  const Delet = "DELETE FROM ?? WHERE transactionId = ?";
  const table = `${businessName}_Transaction`;
  const DeletValues = [table, transactionId];
  // ownerId;BusinessName;
  //console.log("x is ", x);
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
      //console.error(error);
      res.json({ data: "err 501.1" });
    });
  return;
  // let transactionId = req.body.items.transactionId;
  // let businessName = req.body.items.businessName;
  // //console.log(req.body.items);
  // // businessName:
  // // return;
  // let x = await Auth(req.body.items.token);
  // let Delet = `delete from ${businessName}_Transaction where transactionId=${transactionId}`;
  // // ownerId;BusinessName;
  // //console.log("x is ", x);
  // // return;
  // let verify = `select * from Business where BusinessName='${businessName}' and ownerId='${x}' `;
  // connection.query(verify, (err, responce) => {
  //   if (err) {
  //     //console.log(err);
  //     return res.json({ data: err, err });
  //   } else {
  //     if (responce.length > 0)
  //       if (responce[0].BusinessName == req.body.items.businessName) {
  //         // res.json({ data: responce });
  //         connection.query(Delet, (err, results) => {
  //           if (err) {
  //             //console.log(err);
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
      //console.error(error);
      res.json({ data: "err 501.1" });
    });
  // let businessName = req.body.businessName,
  //   costsId = req.body.costsId,
  //   Token = req.body.Token;
  // let userId = await Auth(Token);
  // let select = `select * from Business where BusinessName= '${businessName}' and ownerId ='${userId}'`;
  // connection.query(select, (err, responce) => {
  //   if (err) //console.log(err);
  //   if (responce.length > 0) {
  //     let deleteCostItem = `delete from ${businessName}_Costs where costsId='${costsId}'`;
  //     connection.query(deleteCostItem, (err, results) => {
  //       if (err) //console.log(err);
  //       if (results) {
  //         res.json({ data: "deleted" });
  //       }
  //       //console.log(results);
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
      //console.log("@GetMinimumQty ", rows);
    })
    .catch((error) => {
      //console.log(error);
      res.json({ data: "err", error });
    });
  // let token = req.body.token,
  //   businessName = req.body.businessName,
  //   select = `select * from ${businessName}_Transaction,${businessName}_products where productIDTransaction=ProductId order by registeredTime desc limit 1`;

  // connection.query(select, (err, results) => {
  //   if (err) {
  //     //console.log(err);

  //     res.json({ data: "err", err });
  //   }
  //   if (results) {
  //     res.json({ data: results });
  //     //console.log("@GetMinimumQty ", results);
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
        //console.log(rows);
        return res.json({ data: rows, values });
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
            //console.log(error);
            return res.json({ data: error });
          });
      } else {
        return res.json({ data: "NoDataLikeThis" });
      }
    })
    .catch((error) => {
      //console.log(error);
      return res.json({ data: error });
    });
  return;
  // return res.json({ data: req.body });
  // let userID = await Auth(req.body.token);
  // let getEmployeerBusiness = `select * from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
  // connection.query(getEmployeerBusiness, (err, results) => {
  //   if (err) //console.log(err);
  //   // res.json({ data: results });
  //   if (results.length > 0) {
  //     let deleteData = `delete from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
  //     connection.query(deleteData, (error, resultsOfSelect) => {
  //       if (error) {
  //         //console.log(error);
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
      //console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
server.post(path + "deleteExpencesItem", (req, res) => {
  // //console.log('deleteExpencesItem')
  // return
  let sql = `DELETE FROM ?? WHERE expenseId = ?`;
  let params = [`${req.body.businessName}_expenses`, req.body.expenseId];

  Pool.query(sql, params)
    .then((result) => {
      res.status(200).json({ data: "deleteSuccess" });
    })
    .catch((err) => {
      //console.error(err);
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
            //console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        res.status(404).json({ error: "Phone number not found" });
      }
    })
    .catch((err) => {
      //console.error(err);
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
      //console.error(err);
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
      //console.error(err);
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
server.get("/getUsersCreditList", async (req, res) => {
  try {
    let { token, businessName, businessId, fromDate, toDate } = req.query;
    //console.log("getUsersCreditList token", token);
    // res.json({ token });
    let { userId } = jwt.verify(token, tokenKey);
    // sold on credit only
    let SelectFromDaily = `select * from dailyTransaction , ${businessName}_products where salesTypeValues = 'On credit' and ${businessName}_products.ProductId = dailyTransaction.ProductId and businessId=${businessId} and registrationDate between '${fromDate}' and '${toDate}'`,
      sqlToCreditPaied = "",
      soldInDaily_SoldOncredits = [],
      soldInDaily_CreditPaied = [],
      soldInDaily_CreditPaied_maynotInTime = [];
    let SelectOnCreditFromTotal = "";
    if (fromDate == "notInDateRange" || toDate == "notInDateRange") {
      SelectFromDaily = `select * from dailyTransaction , ${businessName}_products where salesTypeValues = 'On credit' and ${businessName}_products.ProductId = dailyTransaction.ProductId and businessId=${businessId}`;
      SelectOnCreditFromTotal = `select * from ${businessName}_Transaction , ${businessName}_products where salesTypeValues = 'On credit' and ProductId = productIDTransaction`;
    } else {
      //Credit collecteds only from dailyTransaction in specific date
      sqlToCreditPaied = `select * from dailyTransaction , ${businessName}_products where salesTypeValues = 'Credit paied' and ${businessName}_products.ProductId = dailyTransaction.ProductId and businessId=${businessId} and creditPaymentDate between '${fromDate}' and '${toDate}'`;
      await Pool.query(sqlToCreditPaied)
        .then(([data]) => {
          //console.log(data);
          soldInDaily_CreditPaied = data;
        })
        .catch((error) => {
          //console.log(error);
        });

      let sqlToCreditPaied_MayNotInTime = `select * from dailyTransaction , ${businessName}_products where salesTypeValues = 'Credit paied' and ${businessName}_products.ProductId = dailyTransaction.ProductId and businessId=${businessId} and registrationDate between '${fromDate}' and '${toDate}'`;
      await Pool.query(sqlToCreditPaied_MayNotInTime)
        .then(([data]) => {
          console.log(
            "sqlToCreditPaied_MayNotInTime",
            sqlToCreditPaied_MayNotInTime
          );
          console.log("soldInDaily_CreditPaied_maynotInTime, data , ", data);
          soldInDaily_CreditPaied_maynotInTime = data;
        })
        .catch((error) => {
          //console.log(error);
        });
      // salesTypeValues = 'On credit' get oncredit sales from total by date ranges
      SelectOnCreditFromTotal = `select * from ${businessName}_Transaction , ${businessName}_products where salesTypeValues = 'On credit' and ProductId = productIDTransaction and registeredTime between '${fromDate}' and '${toDate}'`;
    }

    // soldInDaily_CreditPaied_maynotInTime
    await Pool.query(SelectFromDaily)
      .then(([data]) => {
        // //console.log("SelectFromDaily data", data);
        soldInDaily_SoldOncredits = data;
      })
      .catch((error) => {
        //console.log("error", error);
      });
    // items sold in credit from total transactions

    // {On cash,By bank,On credit}
    await Pool.query(SelectOnCreditFromTotal)
      .then(([data]) => {
        //console.log(data);
        res.json({
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit: data,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
        });
      })
      .catch((error) => {
        //console.log(error);
        res.json({ data: "error no 890" });
      });
  } catch (error) {
    console.log("error", error);
    res.json({ data: "error no 891" });
  }
});
server.put("/paymentConfirmed", async (req, res) => {
  // res.json({ data: req.body });
  let { data, businessName, token, CollectionDate, salesWAy } = req.body;
  // get userId from token
  let { userID } = jwt.verify(token, tokenKey);
  // //console.log("userId", userID, "token", token, "tokenKey ", tokenKey);
  // return;
  let select = `select * from Business where ownerId='${userID}' and BusinessName='${businessName}'`;
  let verifiOwnership = "not correct owner";
  await Pool.query(select)
    .then(([result]) => {
      //console.log("paymentConfirmed result", result);
      if (result.length > 0) verifiOwnership = "correct owner";
    })
    .catch(() => {
      verifiOwnership = "error on confirmation";
    });
  if (verifiOwnership !== "correct owner") {
    return res.json({ data: verifiOwnership });
  }
  if (salesWAy == "singleSales") {
    // update single sales
    let { dailySalesId } = data;
    let update = `update dailyTransaction set salesTypeValues='Credit paied',creditPaymentDate='${CollectionDate}' where dailySalesId='${dailySalesId}'`;
    await Pool.query(update)
      .then((data) => {
        //console.log("data", data);
        res.json({ data: "udate successfull" });
      })
      .catch((error) => {
        //console.log("error", error);
      });
    return;
  }
  //console.log("paymentConfirmed data ", data);
  let { transactionId } = data;
  let update = `update ${businessName}_Transaction set salesTypeValues='Credit paied',creditPayementdate='${CollectionDate}' where transactionId= ${transactionId}`;
  Pool.query(update)
    .then((data) => {
      //console.log("data", data);
      res.json({ data: "udate successfull" });
    })
    .catch((error) => {
      //console.log("error", error);
    });
});
server.delete(path + "deleteDailyTransaction", (req, res) => {
  //console.log("req.body.source:");
  let { dailySalesId } = req.body.source;
  let deleteSql = `delete from dailyTransaction where dailySalesId='${dailySalesId}'`;
  Pool.query(deleteSql)
    .then((data) => {
      //console.log("data deleteDailyTransaction", data);
      res.json({ data: "success" });
      //console.log(data);
    })
    .catch((error) => {
      res.json({ data: "error", error: "error no 23" });
      //console.log(error);
    });
});
server.put(path + "editDailyTransaction", (req, res) => {
  let x = ({
    dailySalesId,
    Description,
    brokenQty,
    creditPaymentDate,
    creditsalesQty,
    purchaseQty,
    registrationDate,
    salesQty,
    salesTypeValues,
  } = req.body.items);
  //console.log(" req.body.items", x);
  // return;
  let update = `update dailyTransaction set purchaseQty=?,  salesQty=?,
  creditsalesQty=?,salesTypeValues=?,creditPaymentDate=?,  brokenQty=?,
  Description=? where dailySalesId=? `,
    values = [
      purchaseQty,
      salesQty,
      creditsalesQty,
      salesTypeValues,
      creditPaymentDate,
      brokenQty,
      Description,
      dailySalesId,
    ];
  Pool.query(update, values)
    .then((data) => {
      //console.log([data]);
      res.json({ data: "update successfully" });
    })
    .catch((error) => {
      res.json({ data: error });
      //console.log("error", error);
    });
  // res.json({ data: req.body });
});
