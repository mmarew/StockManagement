let cors = require("cors");
let express = require("express");
let bcrypt = require("bcryptjs");
let Auth = require("./Auth.js").Auth;
let dotenv = require("dotenv");
let sqlstring = require("sqlstring");
let mysql2 = require("mysql2");
let tokenKey = "shhhhh";
let { CurrentYMD } = require("./DateFormatter.js");
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
try {
  server.listen(process.env.serverPort, (err) => {
    if (err) {
      return res.json({ err });
    } else {
      console.log(`connected at ${process.env.serverPort}`);
    }
  });
} catch (error) {
  console.log(error);
}
server.post(path, (req, res) => {
  res.end(
    "<h1><center>This is server is running well in post methodes.</center></h1>"
  );
});
server.get(path, async (req, res) => {
  //   let alterBusiness = `ALTER TABLE Business
  // ADD uniqueBusinessName VARCHAR(900)`;
  //   let results = await Pool.query(alterBusiness);
  //   res.json({ data: results });
  //   return console.log("results", results);
  let select = "select * from Business ";
  let myData = [];
  await Pool.query(select)
    .then(([results]) => {
      myData = results;
      results.map(async (data) => {
        let { BusinessName, BusinessID, ownerId, createdDate } = data;
        // businessName, ownerId, createdDate, res, source;
        // await createBusiness(BusinessName, ownerId, createdDate, res, "");

        // let update = `update Business set uniqueBusinessName='${BusinessName}' where BusinessID='${BusinessID}'`;
        // let updateResults = await Pool.query(update);
        // console.log("updateResults", updateResults);
        // lllllllllllll
        // Execute the SQL statement to add columns to the table
        // using the appropriate database library or framework`;

        // res.json({ data });
      });
    })
    .catch((error) => {
      //console.log(error);
    });

  res.json({ data: "myData" });
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
  try {
    let phoneNumber = req.body.phoneNumber;
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
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.log("error", error);
  }
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

      let businessName = result[0].uniqueBusinessName;

      if (result[0].ownerId !== userId) {
        return res.json({ data: "notAllowedFroYou" });
      }

      let selectProduct = `SELECT productName FROM ?? WHERE productName = ?`;
      Pool.query(selectProduct, [`${businessName}_products`, productName])
        .then(([rows]) => {
          result = rows;
          if (result.length == 0) {
            let insertProduct = `INSERT INTO ?? (productsUnitCost, productsUnitPrice, productName, minimumQty,Status) VALUES (?, ?, ?, ?, ?)`;
            Pool.query(insertProduct, [
              `${businessName}_products`,
              productCost,
              productPrice,
              productName,
              minimumQty,
              "active",
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
  try {
    let { token, BusinessId, businessName } = req.body;
    businessName = await getUniqueBusinessName(BusinessId, token);
    if (businessName == "you are not owner of this business") {
      return businessName;
    }
    let select = "SELECT * FROM ?? where Status='active'";
    let table = `${businessName}_products`;
    let [rows] = await Pool.query(select, [table]);
    //console.log("in getRegisteredProducts", rows);
    res.json({ data: rows });
  } catch (error) {
    console.log("error", error);
    res.json({ data: "Error" });
  }
});
server.post(path + "registerTransaction/", async (req, res) => {
  try {
    const rowData = req.body;
    console.log("@registerTransaction rowData is = ", rowData);
    // return;
    let { businessId, token } = rowData,
      businessName = await getUniqueBusinessName(businessId, token);
    const validate = validateAlphabet(businessName, res);

    if (validate === "correctData") {
      const productsList = rowData.ProductsList;
      const length = productsList.length;
      const insertableProducts = [];
      const inventoryList = [];
      for (let i = 0; i < length; i++) {
        let product = productsList[i],
          productID = product.ProductId,
          registrationSource = rowData[`registrationSource${productID}`],
          mainProductId = productsList[i].mainProductId,
          salesQuantity = rowData[`salesQuantity${productID}`],
          salesTypeValues = rowData[`salesTypeValues${productID}`],
          creditDueDate = rowData[`creditDueDate${productID}`],
          purchaseQty = rowData[`purchaseQty${productID}`],
          creditSalesQty = rowData[`creditSalesQty${productID}`],
          wrickageQty = rowData[`wrickageQty${productID}`],
          description = rowData[`Description${productID}`],
          businessId = product.businessId;
        if (
          mainProductId == null ||
          mainProductId == "null" ||
          isNaN(mainProductId)
        ) {
          mainProductId = productID;
        }
        if (creditSalesQty == null || creditSalesQty == "null") {
          creditSalesQty = 0;
        }
        //Select to check if item is registered in this day
        const selectToCheck = `SELECT * FROM ?? WHERE  registeredTime  LIKE ? AND productIDTransaction = ?`;
        const table = `${businessName}_Transaction`;
        const valuesOfTransactions = [table, `%${rowData.dates}%`, productID];
        const [rows] = await Pool.query(selectToCheck, valuesOfTransactions);
        if (rows.length > 0) {
          // If the product is already registered
          continue;
        } else {
          // Get previous inventory
          const prevInventoryQuery =
            "SELECT * FROM ?? WHERE mainProductId = ? AND  registeredTime <=? ORDER BY  registeredTime  DESC LIMIT 1";
          const prevInventoryTable = `${businessName}_Transaction`;
          const prevInventoryValues = [
            prevInventoryTable,
            mainProductId,
            rowData.dates,
          ];
          const [prevInventoryRows] = await Pool.query(
            prevInventoryQuery,
            prevInventoryValues
          );
          // console.log(
          //   "prevInventoryRows === ",
          //   prevInventoryRows,
          //   "previousProductId === ",
          //   previousProductId
          // );
          // // return;
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
          const insertQuery = `INSERT INTO ${businessName}_Transaction(description, unitCost, unitPrice, productIDTransaction, mainProductId, salesQty, purchaseQty, registeredTime, wrickages, Inventory,creditDueDate,salesTypeValues,creditSalesQty,registrationSource) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          let Values = [
            description,
            product.productsUnitCost,
            product.productsUnitPrice,
            productID,
            mainProductId,
            salesQuantity,
            purchaseQty,
            rowData.dates,
            wrickageQty,
            Inventory,
            creditDueDate,
            salesTypeValues,
            creditSalesQty,
            registrationSource,
          ];
          if (registrationSource == "Single") {
            console.log("first");
            let Update = `update dailyTransaction set reportStatus='reported to total sales' where registeredTimeDaily='${rowData.dates}' and businessId='${businessId}' and ProductId='${productID}'`;
            console.log("Update is ===", Update);
            let resultsOfUpdateDailyTransaction = await Pool.query(Update);
            console.log(
              "resultsOfUpdateDailyTransaction",
              resultsOfUpdateDailyTransaction
            );
          }
          // return;
          await Pool.query(insertQuery, Values);
          const insertedProduct = {
            mainProductId,
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
  const select = `SELECT * FROM ?? as t INNER JOIN ?? as p ON p.productId = t.productIDTransaction WHERE t.registeredTime LIKE ?`;
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
      res.json({ data: "data is ful l of err " });
    });
});
server.post(path + "updateTransactions/", async (req, res) => {
  console.log("@updateTransactions", req.body);
  // return;
  let currentInventory = "",
    prevInventory = "";
  // let previousDay = await getPreviousDay(new Date(req.body.date));
  let validate = validateAlphabet(req.body.businessName, res),
    businessName = "";
  // //console.log("validate", validate);
  if (validate == "correctData") {
    businessName = req.body.businessName;
  } else {
    // this is just to stop execution res is done in validateAlphabet
    return "This data contains string so no need of execution";
  }
  let {
    productId,
    date,
    mainProductId,
    wrickages,
    purchaseQty,
    salesQty,
    salesQtyInCredit,
    Description,
    transactionId,
    salesTypeValues,
    creditPayementdate,
  } = req.body;
  let sqlToCheckPartialPayment = `select salesTypeValues from ?? where transactionId=?`;
  let selectPartialValue = [`${businessName}_Transaction`, transactionId];
  let [partialValues] = await Pool.query(
    sqlToCheckPartialPayment,
    selectPartialValue
  );
  console.log("partialValues", partialValues[0].salesTypeValues);
  "Credit paied", "Partially paied";
  let savedSalestypeValues = partialValues[0].salesTypeValues;
  if (savedSalestypeValues == "Partially paied") {
    salesTypeValues = savedSalestypeValues;
  }
  // return;

  const selectQuery = `SELECT * FROM ?? WHERE registeredTime<? AND mainProductId = ?  order by  registeredTime  desc limit 1 `;
  const SelectValues = [`${businessName}_Transaction`, date, mainProductId];
  console.log("mainProductId:", mainProductId, "date", date);
  // return;
  let [data] = await Pool.query(selectQuery, SelectValues);
  console.log("data", data);
  currentInventory =
    Number(purchaseQty) -
    Number(salesQty) -
    Number(salesQtyInCredit) -
    Number(wrickages);
  if (data.length > 0) {
    prevInventory = parseInt(data[0].Inventory);
    currentInventory += prevInventory;
  }
  console.log("currentInventory", currentInventory);
  // return;
  // Headers
  const updateQuery = `UPDATE ?? SET wrickages=?, purchaseQty=?, salesQty=?, creditsalesQty=?,Inventory=?, description=? , salesTypeValues=?,creditPayementdate=? WHERE transactionId=?`;
  const params1 = [
    `${businessName}_Transaction`,
    wrickages,
    purchaseQty,
    salesQty,
    salesQtyInCredit,
    currentInventory,
    Description,
    salesTypeValues,
    creditPayementdate,
    transactionId,
  ];

  await Pool.query(updateQuery, params1)
    .then(([results]) => {
      console.log("params1", params1);
      console.log("updateQuery", updateQuery);
      console.log("results on updateQuery======", results);
      // return;

      const sqlToSelect = `SELECT * FROM ?? as t, ?? as p  WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? and ? order by  t.registeredTime desc`;
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
              await updateNextDateInventory(
                `${businessName}_Transaction`,
                [item],
                DateFormatter(item.registrationDate),
                [currentInventory],
                dataToSendResponceToClient
              );
              res.json({ data: rows });
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
  console.log(req.body);
  // return;
  let businessName = "";
  // productName = req.body.InputValue.productName,
  // toDate = req.body.InputValue.toDate,
  // fromDate = req.body.InputValue.fromDate,
  // selectSearches = req.body.InputValue.selectSearches;
  let { toDate, fromDate, selectSearches, productName, token, businessId } =
    req.body.InputValue;
  businessName = await getUniqueBusinessName(businessId, token);
  if (selectSearches == "PRODUCTS") {
    let selectProducts = `select * from ?? where Status='active' || Status IS NULL`;
    let tableName = `${businessName}_products`;
    Pool.query(selectProducts, [tableName])
      .then(([rows]) => {
        console.log("Selected PRODUCTS=", rows);
        return res.json({ data: "no results", products: rows });
      })
      .catch((Error) => {
        console.log("Error", Error);
        return res.json({ Error });
      });
    return;
  } else if (selectSearches == "TRANSACTION") {
    const query = `SELECT *
               FROM ??, ??
               WHERE productIDTransaction = ProductId
               AND productName LIKE CONCAT('%', ?, '%')
               AND  registeredTime  BETWEEN ? AND ?`;

    const table1 = `${businessName}_Transaction`;
    const table2 = `${businessName}_products`;
    // define the input data as an array of values
    const input = [];

    Pool.query(query, [table1, table2, productName, fromDate, toDate])
      .then(([rows]) => {
        console.log("rowsrowsrowsrowsrows", rows);
        res.json({ data: rows });
      })
      .catch((error) => {
        res.json({ error });
      });
  } else if (selectSearches == "ALLTRANSACTION") {
    //console.log("in ALLTRANSACTION req.body == ", req.body);
    const sql = `SELECT * FROM ?? as t, ?? as p WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? AND ? order by t.registeredTime desc`;
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
    let selectAccountRecived = `SELECT * FROM ?? as t, ?? as p  WHERE t.productIDTransaction = p.ProductId AND t.creditPayementdate BETWEEN ? AND ? order by t.creditPayementdate desc`;
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
        // console.log("data in all", rows);
        const sql = `SELECT * FROM ?? as e, ?? as c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
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
  let businessName = req.body.businessName,
    idCurrent = req.body.id,
    productPriceCurrent = req.body.productPrice,
    productNameCurrent = req.body.productName,
    productCostCurrent = req.body.productCost;

  minimumQtyCurrent = req.body.minimumQty;
  let { businessId, token } = req.body;
  businessName = await getUniqueBusinessName(businessId, token);
  console.log("updateProducts businessName", businessName);
  // return;
  let selectFirstId = `select * from  ${businessName}_products where  ProductId = ${idCurrent}`;
  let [Responces] = await Pool.query(selectFirstId);
  let {
    mainProductId,
    ProductId,
    productsUnitCost,
    productsUnitPrice,
    productName,
    minimumQty,
  } = Responces[0];

  if (mainProductId == null) mainProductId = ProductId;
  console.log("mainProductId", mainProductId);
  console.log("CurrentYMD", CurrentYMD);
  // return;
  const insertQuery = `INSERT INTO ${businessName}_products (productRegistrationDate,productsUnitCost, productsUnitPrice, productName, minimumQty, mainProductId, prevUnitCost,prevUnitPrice, prevProductName, prevMinimumQty, Status)VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
  const values = [
    CurrentYMD,
    productCostCurrent,
    productPriceCurrent,
    productNameCurrent,
    minimumQtyCurrent,
    mainProductId,
    productsUnitCost,
    productsUnitPrice,
    productName,
    minimumQty,
    "active",
  ];
  console.log("insertQuery", insertQuery);
  console.log("values", values);
  // return;

  const [result] = await Pool.query(insertQuery, values);
  console.log("Data insertQuery", result.rows);

  // define the input data as an array of values
  // execute the query with the input data
  // return;
  if (result.length == 0) {
    return res.json({ data: "unable to make updates" });
  }

  const sql = `UPDATE ${businessName}_products SET status='changed'  WHERE ProductId = ${idCurrent}`;
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
  let { token, businessId } = req.body;
  let businessName = await getUniqueBusinessName(businessId, token);
  if (businessName == "you are not owner of this business")
    return res.json({ data: "you are not owner of this business" });
  insertIntoCosts(`${businessName}_Costs`, req.body, res);
});
server.post(path + "getCostLists/", async (req, res) => {
  // //console.log(req.body);
  let { businessId, token } = req.body;
  let businessName = await getUniqueBusinessName(businessId, token);
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
server.post(`/registerExpenceTransaction/`, async (req, res) => {
  let rowData = req.body;
  console.log("rowData", rowData);
  // return;
  let { businessId, token, costData, costDate } = req.body;
  let businessName = await getUniqueBusinessName(businessId, token);
  console.log("businessName", businessName);
  // return;
  const sql = "SELECT * FROM ?? WHERE costRegisteredDate = ? and costId=?";
  let costId = costData[0].costsId;
  // define the input data as an array of values
  const input = [`${businessName}_expenses`, date, costId];
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
        const table = `${businessName}_expenses`;
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
  console.log(
    "931 businessName",
    businessName,
    "ProductsList",
    ProductsList,
    "date",
    date,
    "previousInventory",
    previousInventory,
    "dataToSendResponceToClient",
    dataToSendResponceToClient
  );
  // return;
  try {
    // console.log("dataToSendResponceToClient======", dataToSendResponceToClient);
    // return;
    let sqlToSelect, inputToSelect, res;
    let dataSent = 0;
    function sendResponses() {
      if (
        typeof dataToSendResponceToClient == "object" &&
        dataToSendResponceToClient !== "NoNeed"
      ) {
        sqlToSelect = dataToSendResponceToClient.sqlToSelect;
        inputToSelect = dataToSendResponceToClient.inputToSelect;
        res = dataToSendResponceToClient.res;

        Pool.query(sqlToSelect, inputToSelect).then(([rows]) => {
          console.log("rows", rows);
          dataSent++;
          if (dataSent == 1) res.json({ data: rows });
          return;
        });
      }
    }

    //console.log("903 =", businessName, ProductsList, date, previousInventory);

    let index = 0;

    let recursiveUpdate = async () => {
      if (index < ProductsList.length) {
        let { productId, previousProductId, mainProductId } =
          ProductsList[index];
        console.log("first");

        if (mainProductId == null || mainProductId == "null")
          mainProductId = productId;
        //////11111111
        let select = `SELECT * FROM ?? WHERE mainProductId=? AND 
         registeredTime>? ORDER BY  registeredTime  ASC`;
        let values = [businessName, mainProductId, date];
        try {
          const [rows] = await Pool.query(select, values);

          console.log("rows", rows);
          // return;
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

              try {
                await Pool.query(update, valuesToUpdate).then((results) => {
                  //console.log("results", results);
                  if (i >= rows.length - 1) {
                    sendResponses();
                  }
                });
              } catch (error) {
                console.log(err);
                return res.json({ err: error });
              }
            }
          } else {
            sendResponses();
          }

          index++;
          recursiveUpdate(); // Call the recursive function to process the next product
        } catch (error) {
          console.log(error);
        }
      } else {
        sendResponses(); // All products have been processed, send the responses
      }
    };

    await recursiveUpdate();
  } catch (error) {
    console.log("error is= ", error);
  }
};
let x = [
  {
    mainProductId: 1,
    creditSalesQty: 120,
    creditDueDate: "",
    salesTypeValues: "On cash, On credit, On cash, ",
    Description: "description one Good and well 12121 ",
    productsUnitCost: 15000,
    productsUnitPrice: 18000,
    ProductId: 1,
    salesQuantity: 92,
    purchaseQty: 0,
    wrickageQty: 0,
    Inventory: -212,
  },
];
// updateNextDateInventory(
//   "DesetawHappyShope_Transaction",
//   x,
//   "2023-11-20",
//   [1608],
//   undefined
// );
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

  const query_updateBusinessName =
    "UPDATE Business SET businessName = ? WHERE businessId = ?";
  const values_updateBusinessName = [businessName, targetBusinessId];
  Pool.query(query_updateBusinessName, values_updateBusinessName)
    .then(([results]) => {
      //console.log("Update successful:", results);
      // Do something else
      res.json({ data: "updated successfully" });
    })
    .catch((error) => {
      console.log("error", error);
      res.json({ data: "error" });
      //console.error("An error occurred:", error);
      // Handle the error
    });
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
server.post(path + "getsingleProducts/", async (req, res) => {
  let productName = req.body.searchInput;
  let { token, businessId, Target } = req.body;
  console.log("req.body", req.body);

  let businessName = await getUniqueBusinessName(businessId, token);
  console.log("businessName", businessName);
  // return;
  let query = `SELECT * FROM ?? WHERE productName LIKE ? and Status=?`;
  let values = [`${businessName}_products`, "%" + productName + "%", "active"];
  if (Target == "All Products") {
    query = `SELECT * FROM ?? WHERE Status=?`;
    values = [`${businessName}_products`, "active"];
  }
  //console.log("values==", values, "query==", query);
  Pool.query(query, values)
    .then(([rows]) => {
      //console.log(rows);
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
  console.log("req.body", req.body);
  // return;
  let salesTypeColumn = "salesQty";
  if (salesType == "On credit") {
    salesTypeColumn = "creditsalesQty";
  }
  // salesTypeValues; creditPaymentDate
  const query = `INSERT INTO dailyTransaction (purchaseQty, ${salesTypeColumn},salesTypeValues,creditPaymentDate,businessId, ProductId, brokenQty, Description, registeredTimeDaily,itemDetailInfo,reportStatus) VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?,?)`;
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
    "unreported to total sales",
  ];

  Pool.query(query, values)
    .then(([result]) => {
      //console.log(`Inserted ${result.affectedRows} row(s)`);
      // Do something else
      console.log("result", result);
      res.json({ data: "successfullyRegistered" });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      res.json({ data: "err", err: error });
      // Handle the error
    });
});
server.post(path + "getDailyTransaction/", async (req, res) => {
  let getTransaction = "";
  let { productId, businessId, currentDates, businessName, token } = req.body;
  businessName = await getUniqueBusinessName(businessId, token);
  // console.log("businessName", businessName);
  // console.log("req.body", req.body);
  // return;
  let query, values;
  if (productId === "getAllTransaction") {
    query = `
    SELECT *
    FROM ?? AS dt
    JOIN ?? AS bp
    ON bp.ProductId = dt.ProductId
    WHERE dt.businessId = ?
    AND dt.registeredTimeDaily = ?  `;
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
    AND dt.registeredTimeDaily = ? `;
    values = [
      "dailyTransaction",
      `${businessName}_products`,
      businessId,
      productId,
      currentDates,
    ];
  }
  console.log("11 111 11 111 values", values, " query", query);
  console.log("marew");
  console.log("values", values);
  Pool.query(query, values)
    .then(([rows]) => {
      //console.log(rows);
      // Do something else
      console.log("rows", rows);
      res.json({ data: rows, getTransaction });
    })
    .catch((error) => {
      console.log("error", error);
      res.json({ data: error });
      //console.error("An error occurred:", error);
      // Handle the error
    });
});
server.post(path + "deleteBusines/", async (req, res) => {
  deleteBusiness(req.body, res);
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
  try {
    let userID = await Auth(req.body.storeToken);
    console.log("userID", userID);

    let SelectUser = `SELECT * FROM usersTable WHERE userId = ?`;
    let selectBusiness = `SELECT * FROM Business WHERE ownerId = ?`;
    let Drop = `DROP TABLE IF EXISTS ??, ??, ??, ??`;
    let deleteBusiness = `DELETE FROM Business where ownerId = '${userID}'`;
    let deleteUsers = `DELETE FROM usersTable WHERE userId ='${userID}'`;

    try {
      const [results] = await Pool.query(SelectUser, [userID]);
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
          const [result1] = await Pool.query(selectBusiness, [userID]);
          console.log("result1", result1);

          if (result1.length > 0) {
            let BusinessName = result1[0].uniqueBusinessName;
            let tables = [
              `${BusinessName}_expenses`,
              `${BusinessName}_Costs`,
              `${BusinessName}_products`,
              `${BusinessName}_Transaction`,
            ];
            const [DeleteResults] = await Pool.query(Drop, tables);
            console.log("DeleteResults", DeleteResults);
          } else {
            console.log("opopop");
          }

          try {
            const [deleteResult] = await Pool.query(deleteBusiness);
            const [deleteUsersResult] = await Pool.query(deleteUsers);
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
});

// server.post(path + "deleteUsers/", async (req, res) => {
//   try {
//     let userID = await Auth(req.body.storeToken);
//     //console.log("myId", userID);
//     // //console.log(res.json({ data: myId }));
//     console.log("userID", userID);

//     let SelectUser = `SELECT * FROM usersTable WHERE userId = ?`;
//     let selectBusiness = `SELECT * FROM Business WHERE ownerId = ?`;
//     let Drop = `DROP TABLE IF EXISTS ??, ??, ??, ??`;
//     let deleteBusiness = `DELETE FROM Business where ownerId = '${userID}'`;
//     let deleteUsers = `DELETE FROM usersTable WHERE userId ='${userID}'`;
//     Pool.query(SelectUser, [userID])
//       .then(([results]) => {
//         if (results) {
//           let Password = req.body.Password;
//           let savedPassword = results[0].password;
//           console.log("savedPassword", savedPassword);
//           console.log("Password", Password);
//           const isMatch = bcrypt.compareSync(Password, savedPassword);
//           console.log("isMatch", isMatch);

//           if (!isMatch) {
//             res.json({ data: "wrong password" });
//             return;
//           }
//           // console.log("results", results);
//           if (results.length > 0) {
//             Pool.query(selectBusiness, [userID])
//               .then(async ([result1]) => {
//                 console.log("result1", result1);
//                 if (result1.length > 0) {
//                   let BusinessName = result1[0].uniqueBusinessName;
//                   let tables = [
//                     `${BusinessName}_expenses`,
//                     `${BusinessName}_Costs`,
//                     `${BusinessName}_products`,
//                     `${BusinessName}_Transaction`,
//                   ];
//                   let [DeleteResults] = await Pool.query(Drop, tables);
//                   console.log("DeleteResults", DeleteResults);
//                   return "";
//                 } else {
//                   console.log("opopop");
//                   return "";
//                 }
//               })
//               .then(async ([result2]) => {
//                 try {
//                   console.log("result2result2result2result2");
//                   let [deleteResult] = await Pool.query(deleteBusiness);
//                   let [deleteUsersResult] = await Pool.query(deleteUsers);
//                   console.log("deleteUsersResult", deleteUsersResult);
//                   console.log("deleteResult", deleteResult);
//                 } catch (error) {
//                   console.log("error on result2", error);
//                 }
//               })
//               .then(([response]) => {
//                 res.json({ data: "deleted data" });
//               })
//               .catch((error) => {
//                 console.error(error);
//                 res.json({ data: "error 90" });
//               });
//           } else {
//             res.json({ data: results });
//           }
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         res.json({ data: "err 5.908" });
//       });
//   } catch (error) {
//     console.log("error", error);
//   }
// });
server.post(path + "/updateCostData/", async (req, res) => {
  // let businessName = req.body.businessName,
  //   CostName_ = req.body.CostName_,
  //   costsId = req.body.costsId;
  let { businessName, CostName_, costsId, businessId, token } = req.body;
  if (
    token == "" ||
    token == null ||
    token == "null" ||
    token == undefined ||
    token == "undefined"
  ) {
    return res.json({ data: "wrong token" });
  }
  businessName = await getUniqueBusinessName(businessId, token);
  console.log("@updateCostData businessName", businessName);
  const updateQuery = `UPDATE ?? SET costName=? WHERE costsId=?`;
  let values = [businessName + "_Costs", CostName_, costsId];
  // return;
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
      res.json({ data: "err no a11" });
    });
});

server.post(path + "deleteSales_purchase/", async (req, res) => {
  try {
    console.log("req.body.items", req.body.items);
    let { token, transactionId, businessId } = req.body.items;
    const x = await Auth(token);
    let businessName = await getUniqueBusinessName(businessId, token);
    const Delet = "DELETE FROM ?? WHERE transactionId = ?";
    const table = `${businessName}_Transaction`;
    const DeletValues = [table, transactionId];
    const verify =
      "SELECT * FROM Business WHERE uniqueBusinessName=? AND ownerId = ?";
    const verifyValues = [businessName, x];
    console.log("businessName", businessName, " ");
    // return;
    Pool.query(verify, verifyValues)
      .then(([rows]) => {
        if (rows.length > 0) {
          return Pool.query(Delet, DeletValues).then((results) => {
            return res.json({ data: "deleted", results });
          });
        } else {
          return res.json({ data: "NotAllowedByYou" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({ data: "err 112.1" });
      });
  } catch (error) {
    console.log(error);
    res.json({ data: "error no 2020" });
  }
});
server.post(path + "deleteCostData", async (req, res) => {
  let { Token, costsId, businessName, businessId } = req.body;
  businessName = await getUniqueBusinessName(businessId, Token);
  const userId = await Auth(Token);
  const select =
    "SELECT * FROM Business WHERE uniqueBusinessName = ? AND ownerId = ?";
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
});
let getUniqueBusinessName = async (businessId, token) => {
  try {
    let { userID } = jwt.verify(token, tokenKey);
    let getBusinessData = `select * from Business where BusinessID='${businessId}' and ownerId='${userID}'`;
    // userIdInEmployee int,BusinessIDEmployee int, employerId
    let selectAsEmployee = `select * from employeeTable,Business where userIdInEmployee='${userID}' and BusinessIDEmployee='${businessId}'  and BusinessID=BusinessIDEmployee`;

    let [businessData] = await Pool.query(getBusinessData);
    if (businessData.length == 0) {
      // check if u r employee
      let [employeeResult] = await Pool.query(selectAsEmployee);
      if (employeeResult.length > 0) {
        let { uniqueBusinessName } = employeeResult[0];
        return uniqueBusinessName;
      }
      return "you are not owner of this business";
    }

    let { uniqueBusinessName } = businessData[0];
    return uniqueBusinessName;
  } catch (error) {
    console.log("error", error);
    return "Error ";
  }
};

server.post(path + "GetMinimumQty/", async (req, res) => {
  const { businessId, token } = req.body;
  let uniqueBusinessName = await getUniqueBusinessName(businessId, token);

  if (uniqueBusinessName === "you are not owner of this business") {
    return res.json({ data: uniqueBusinessName });
  }

  console.log("uniqueBusinessName", uniqueBusinessName);
  const table = `${uniqueBusinessName}_`;

  const selectInventory = `
    SELECT P.*, T.*
    FROM ${table}products AS P
    LEFT JOIN ${table}Transaction AS T
    ON T.productIDTransaction = P.ProductId
    WHERE T.registeredTime = (
      SELECT MAX(registeredTime)
      FROM ${table}Transaction
      WHERE productIDTransaction = P.ProductId
    ) ORDER BY P.ProductId`;

  try {
    const [result] = await Pool.query(selectInventory);
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
    return res.json({ data: "@minimumerr", error });
  }
});

server.post(path + "getMaximumSales/", async (req, res) => {
  let { token, businessName, DateRange, businessId } = req.body;
  let { toDate, fromDate } = DateRange;
  let uniqueBusinessName = await getUniqueBusinessName(businessId, token);
  if (uniqueBusinessName == `you are not owner of this business`) {
    return res.json({ data: uniqueBusinessName });
  }
  businessName = uniqueBusinessName;
  // let select = `select * from ${businessName}_products, ${businessName}_Transaction where  ProductId = productIDTransaction and  registrationDate  between '${toDate}' and '${fromDate}'`;
  const table1 = `${businessName}_products`;
  const table2 = `${businessName}_Transaction`;

  const select = `SELECT *
                FROM ?? as P, ?? AS T
                WHERE ProductId = productIDTransaction
                AND  T.registeredTime  BETWEEN ? AND ?`;

  const values = [table1, table2, fromDate, toDate];

  Pool.query(select, values)
    .then(([rows]) => {
      if (rows) {
        //console.log(rows);
        return res.json({ data: rows, values });
      }
    })
    .catch((error) => {
      console.log(error);
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
  let { productId, mainProductId } = req.body;

  let deleteData = `DELETE FROM ?? WHERE ProductId = ? or mainProductId=?`;

  Pool.query(deleteData, [
    `${businessName}_products`,
    mainProductId,
    mainProductId,
  ])
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
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          });
      } else {
        console.log("error", "Phone number not found");
        return res.status(404).json({ error: "Phone number not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
server.post(path + "updateChangeInpassword/", async (req, res) => {
  try {
    let phoneNumber = req.body.PhoneNumber;
    let password = req.body.Password.password;
    let retypedPassword = req.body.Password.retypedPassword;

    if (password !== retypedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, salt);
    let update = `UPDATE usersTable SET password = ? WHERE phoneNumber = ?`;
    let [result] = await Pool.query(update, [encryptedPassword, phoneNumber]);

    if (result.affectedRows > 0) {
      res.status(200).json({ data: "passwordChanged" });
    } else {
      res.status(404).json({ data: "unableToMakeChange" });
    }
  } catch (error) {
    console.log("error");
  }
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
//////////////////////////////////

server.get("/getUsersCreditList", async (req, res) => {
  try {
    let { token, businessName, businessId, fromDate, toDate } = req.query;
    console.log("businessId", businessId);
    // return;
    businessName = await getUniqueBusinessName(businessId, token);
    if (businessName == "you are not owner of this business") {
      return res.json({ data: businessName });
    }

    let { userId } = jwt.verify(token, tokenKey);
    let SelectOnCreditFromDaily = "",
      soldInDaily_SoldOncredits = [],
      SelectOnCreditFromTotal = "",
      selectOncreditFromSingle = "",
      sqlToCollectedMoney = "",
      sqlToCollectedMoneyFromTotalSales = "",
      sqlToCollectedMoneyFromSingleSales = "";
    // select items sold in credit from daily transaction which is single type
    SelectOnCreditFromDaily = `select * from dailyTransaction , ${businessName}_products where (salesTypeValues = 'On credit' or  salesTypeValues = 'Partially paied') and ${businessName}_products.ProductId = dailyTransaction.ProductId and businessId=${businessId}`;
    // select items from transaction where total items sold on credit
    SelectOnCreditFromTotal = `select * from ${businessName}_Transaction , ${businessName}_products where (salesTypeValues = 'On credit' or  salesTypeValues = 'Partially paied') and ProductId = productIDTransaction`;
    /////////////////////////////////
    // sqlToCollectedMoney = `SELECT * FROM creditCollection WHERE businessId='${businessId}'`;
    let transactionTable = `${businessName}_Transaction`,
      productsTable = `${businessName}_products`;

    if (fromDate !== "notInDateRange" && toDate !== "notInDateRange") {
      //Credit collecteds only from dailyTransaction in specific date

      sqlToCollectedMoneyFromSingleSales = `SELECT * FROM creditCollection, dailyTransaction, ${productsTable} WHERE creditCollection.businessId='${businessId}' and creditCollection.collectionDate BETWEEN '${fromDate}' AND '${toDate}' and dailyTransaction.dailySalesId = creditCollection.transactionId and creditCollection.registrationSource='Single' and ${productsTable}.ProductId = creditCollection.targtedProductId`;
      //////////////////////////////////////////////////////////
      sqlToCollectedMoneyFromTotalSales = `SELECT * FROM creditCollection, ${transactionTable} ,${productsTable} WHERE businessId='${businessId}' and creditCollection.collectionDate BETWEEN '${fromDate}' AND '${toDate}' and ${transactionTable}.transactionId = creditCollection.transactionId and creditCollection.registrationSource='total' and ${productsTable}.ProductId = creditCollection.targtedProductId`;
      ////////////////////////////////////////////////////////////
      let dateRanges = ` and registeredTimeDaily between '${fromDate}' and '${toDate}'`;
      SelectOnCreditFromDaily += dateRanges;
      SelectOnCreditFromTotal += ` and registeredTime between '${fromDate}' and '${toDate}'`;
    }
    let partiallyPaidInTotal = [];
    let transactionIdList = [];
    const [Information] = await Pool.query(SelectOnCreditFromDaily);
    soldInDaily_SoldOncredits = Information;
    for (const Info of Information) {
      const transactionId = Info.dailySalesId;
      transactionIdList.push(transactionId);
    }
    const [data] = await Pool.query(SelectOnCreditFromTotal);
    // console.log("SelectOnCreditFromTotal", data);
    // Iterate over the data and push transaction IDs into the list
    for (const d of data) {
      const transactionId = d.transactionId;
      transactionIdList.push(transactionId);
    }
    // console.log("transactionIdList", transactionIdList);
    // Check for date range conditions
    if (
      fromDate === "notInDateRange" &&
      toDate === "notInDateRange" &&
      transactionIdList.length > 0
    ) {
      // let transactionTable='', productsTable='';
      // Construct the SQL query using parameterized values to prevent injection
      sqlToCollectedMoneyFromTotalSales = `SELECT * FROM creditCollection, ${transactionTable} ,${productsTable} WHERE businessId=? and ${transactionTable}.transactionId = creditCollection.transactionId and creditCollection.registrationSource='total' and ${productsTable}.ProductId = creditCollection.targtedProductId and creditCollection.transactionId IN (?)`;
      // `SELECT * FROM creditCollection WHERE businessId = ? AND transactionId IN (?)`;
      sqlToCollectedMoneyFromSingleSales = `SELECT * FROM creditCollection, dailyTransaction, ${productsTable} WHERE creditCollection.businessId=? and dailyTransaction.dailySalesId = creditCollection.transactionId and creditCollection.registrationSource='Single' and ${productsTable}.ProductId = creditCollection.targtedProductId and  creditCollection.transactionId IN (?)`;
      // Execute the query using the Pool instance and sanitized transaction IDs
      let [FromSingleSales] = await Pool.query(
        sqlToCollectedMoneyFromSingleSales,
        [businessId, transactionIdList]
      );
      let [FromTotalSales] = await Pool.query(
        sqlToCollectedMoneyFromTotalSales,
        [businessId, transactionIdList]
      );
      console.log("Money from Total sales", FromTotalSales);
      partiallyPaidInTotal = [...FromTotalSales, ...FromSingleSales];
    } else {
      // [partiallyPaidInTotal] = await Pool.query(sqlToCollectedMoney);
      let FromTotalSales = [],
        FromSingleSales = [];
      if (sqlToCollectedMoneyFromTotalSales != "")
        [FromTotalSales] = await Pool.query(sqlToCollectedMoneyFromTotalSales);
      if (sqlToCollectedMoneyFromSingleSales != "")
        [FromSingleSales] = await Pool.query(
          sqlToCollectedMoneyFromSingleSales
        );
      partiallyPaidInTotal = [...FromTotalSales, ...FromSingleSales];
    }
    //console.log(data);
    res.json({
      partiallyPaidInTotal,
      soldOnTotal_Oncredit: data,
      soldInDaily_SoldOncredits,
    });
  } catch (error) {
    console.log("error", error);
    res.json({ data: "error no 891" });
  }
});

////////////////////////////

server.put(path + "confirmPayments", async (req, res) => {
  console.log(`req.body`, req.body);
  // return;
  let {
    businessId,
    creditPaymentDate,
    collectedAmount,
    salesWAy,
    businessName,
    token,
  } = req.body;
  let {
    dailySalesId,
    transactionId,
    registrationSource,
    ProductId,
    creditsalesQty,
    unitPrice,
    productsUnitPrice,
  } = req.body.data;
  businessName = await getUniqueBusinessName(businessId, token);

  let previouslycollectedAmount = 0;
  console.log("transactionId", transactionId);
  // let select = `select * from creditCollection where transactionId='${transactionId}' and businessId='${businessId}' and registrationSource='Total'`;

  let SalesIncredit = creditsalesQty * productsUnitPrice,
    select = `select * from creditCollection where transactionId='${dailySalesId}' and businessId='${businessId}' and registrationSource='Single'`;

  let [results] = await Pool.query(select);
  // console.log("creditCollection results", results);
  // return;
  results.map((result) => {
    previouslycollectedAmount += Number(result.collectionAmount);
  });
  let tobeCollected = Number(SalesIncredit) - Number(previouslycollectedAmount);
  console.log(
    "previouslycollectedAmount",
    previouslycollectedAmount,
    "SalesIncredit",
    SalesIncredit,
    "tobeCollected ",
    tobeCollected
  );

  if (SalesIncredit == previouslycollectedAmount) {
    let update = `update dailyTransaction set salesTypeValues='Credit paied' where transactionId='${dailySalesId}'`;
    await Pool.query(update);
    return res.json({
      data: `You have collected your money previously. Now you can't collect money again `,
    });
  }

  if (Number(collectedAmount) > tobeCollected) {
    return res.json({
      data: `you can't collect money more than remain amount`,
    });
  }

  if (SalesIncredit == previouslycollectedAmount + Number(collectedAmount)) {
    let update = `update dailyTransaction set salesTypeValues='Credit paied' where dailySalesId='${dailySalesId}'`;
    let [updateResult] = await Pool.query(update);
    console.log("updateResult", updateResult);
  }
  let { userID } = jwt.verify(token, tokenKey);
  // console.log("responces", responces);
  let Insert = `insert into creditCollection(collectionDate,collectionAmount,registrationSource,transactionId,userId,businessId,targtedProductId) 
  values('${creditPaymentDate}','${collectedAmount}','Single', '${dailySalesId}','${userID}','${businessId}','${ProductId}')`;
  console.log("Insert", Insert);
  // return;
  let [responce] = await Pool.query(Insert);
  if (responce.affectedRows > 0) {
    res.json({ data: "You have inserted your data correctly" });
  }
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
  creditsalesQty=?, salesTypeValues=?, creditPaymentDate=?,  brokenQty=?,
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
server.post("/CheckIfUnreportedData", async (req, res) => {
  // res.json({ data: "working" });
  try {
    let { BusinessId, businessName } = req.body;
    let sqlToTelectUnReportedData = `select * from dailyTransaction where reportStatus='unreported to total sales' and businessId='${BusinessId}'`;
    let [results] = await Pool.query(sqlToTelectUnReportedData);
    res.json({ data: results });
  } catch (error) {
    console.log(error);
    res.json({ data: "error", error: "Error no 10" });
  }
});
server.put("/updateUnreportedDataAsReported", (req, res) => {
  res.data({ data: "updateUnreportedDataAsReported" });
});
server.post("/updatePartiallyPaidInfo", async (req, res) => {
  try {
    const { DeletableInfo } = req.body;

    // Sanitize and validate collection IDs to prevent injection attacks
    const sanitizedCollectionIds = DeletableInfo.map((info) => {
      const collectionId = String(info.collectionId).replace(/'/g, "\\'"); // Escape single quotes
      return collectionId;
    });

    // Construct the SQL query using parameterized values to prevent injection
    const sql = `DELETE FROM creditCollection WHERE collectionId IN (?)`;

    // Execute the query using the Pool instance
    await Pool.query(sql, [sanitizedCollectionIds]);

    // Send a successful response
    res.json({ data: "Updated successfully" });
  } catch (error) {
    // Handle errors appropriately, such as logging errors and sending appropriate responses
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
