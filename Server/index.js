let cors = require("cors");
let express = require("express");
let bcrypt = require("bcryptjs");
let Auth = require("./Auth.js").Auth;
let dotenv = require("dotenv");
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
let Database,
  {
    deleteBusiness,
    insertIntoUserTable,
    connection,
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
  let Tokens = req.body.token;
  if (Tokens == "" || Tokens == undefined) {
    return res.json({ data: "You haven't loged in before." });
  }
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let getBusiness = `select * from Business where ownerId='${userID}'`;
  let myBusiness = "",
    employeerBusiness = "";
  connection.query(getBusiness, (err, result) => {
    if (err) {
      return res.json({ err });
    } else {
      // console.log("getBusiness");
      // console.log(result);
      myBusiness = result;
    }
    let getEmployeerBusiness = `select * from employeeTable , Business where userIdInEmployee='${userID}' and Business.BusinessID=employeeTable.BusinessIDEmployee`;
    connection.query(getEmployeerBusiness, (err, results) => {
      if (err) return res.json({ err });
      if (result) {
        employeerBusiness = results;
      }
      res.json({ myBusiness, employeerBusiness });
    });
  });
});
server.post(path + "verifyLogin/", async (req, res) => {
  let token = req.body.token;
  jwt.verify(token, "shhhhh", function (err, decoded) {
    if (err) {
      return res.json({ data: err });
    }
    let userID = decoded.userID;
    let select = `select * from usersTable where userId='${userID}'`;
    connection.query(select, (err, result) => {
      if (err) {
        return res.json({ err, data: "error in the database connection" });
      } else {
        if (result.length > 0) {
          return res.json({ data: "alreadyConnected", decoded, result });
        } else {
          return res.json({ data: "dataNotFound", decoded });
        }
      }
    });
  });

  // res.json({ data: "connection" });
});
server.post(path + "Login/", (req, res) => {
  // console.log(req.body);
  let select = `select * from usersTable where phoneNumber='${req.body.phoneNumber}' limit 1`;
  connection.query(select, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ data: `error code 901` });
    }
    if (result.length == 0) {
      return res.json({ data: "data not found" });
    } else {
      // console.log(result[0].password);
    }
    let savedPassword = result[0].password;
    const isMatch = bcrypt.compareSync(req.body.Password, savedPassword);
    // console.log(isMatch);

    let token = jwt.sign({ userID: result[0].userId }, "shhhhh");

    if (isMatch) {
      return res.json({ data: "loginSuccessFull", token });
    } else {
      return res.json({ data: "password mismatch" });
    }
  });
  // res.json({ data: "connected" });
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
  // console.log("Auth is ", Auth);
  let rowData = req.body,
    productName = rowData.productName,
    productPrice = rowData.productUnitPrice,
    productCost = rowData.productUnitCost,
    businessId = rowData.businessId,
    minimumQty = rowData.minimumQty,
    userId = await Auth(rowData.token),
    businessName = "";
  let select = `select * from  Business where businessId=${businessId}`;
  connection.query(select, (err, result) => {
    if (err) {
      return res.json({ err });
    } else {
      businessName = result[0].BusinessName;
      // console.log("result[0]");
      // console.log(result);

      // console.log(result[0].ownerId);
      if (result[0].ownerId !== userId) {
        res.json({ data: "notAllowedFroYou" });
        return;
      }
      let selectProduct = `select productName from ${businessName}_products where productName='${productName}'`;
      connection.query(selectProduct, (err, result) => {
        if (err) {
          return res.json({ err });
          if (err.sqlState == `42S02`) {
            console.log("please recreate tables again");
            createBusiness(businessName, userId, fullTime, res, "recreate");
          }
          return;
        }
        if (result.length == 0) {
          let Insert = `insert into ${businessName}_products(productsUnitCost,productsUnitPrice,productName,minimumQty)values('${productCost}','${productPrice}','${productName}','${minimumQty}')`;
          connection.query(Insert, (err, result) => {
            if (err) return res.json({ err });
            if (result) {
              // console.log(result);
              res.json({ data: "productIsAdded" });
            }
          });
        } else {
          res.json({ data: "productIsAlreadyAddedBefore" });
        }
      });
    }
  });
});
server.post(path + "createBusiness/", (req, res) => {
  let businessName = req.body.businessName;
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let response = createBusiness(businessName, userID, fullTime, res);
});
server.post(path + "getRegisteredProducts/", async (req, res) => {
  // console.log(req.body.BusinessId, req.body.token, req.body.businessName);
  let select = `select * from ${req.body.businessName}_products`;
  connection.query(select, (err, result) => {
    if (err) return res.json({ err });
    if (result) console.log(result);
    res.json({ data: result });
  });
  // let userId = await Auth(req.body.token);
  // res.end("getRegisteredProducts lllllllllll");
});
server.post(path + "registerTransaction/", async (req, res) => {
  console.log("registerTransaction", req.body);
  // return;
  let rowData = req.body,
    ProductsList = rowData.ProductsList,
    businessName = rowData.businessName,
    i = 0,
    previouslyRegisteredData = [],
    values = "",
    length = ProductsList.length,
    insertedProducts = [],
    InventoryList = [];

  let recurciveTorecheck = () => {
    let productID = ProductsList[i].ProductId,
      unitCost = ProductsList[i].productsUnitCost,
      unitPrice = ProductsList[i].productsUnitPrice,
      salesQuantity = "salesQuantity" + productID,
      purchaseQty = "purchaseQty" + productID,
      wrickageQty = "wrickageQty" + productID,
      Inventory = 0;
    // console.log("salesQuantity", salesQuantity);
    let selectToCheck = `select * from  ${businessName}_Transaction where registeredTime like '%${req.body.dates}%' and productIDTransaction='${productID}'`;
    connection.query(selectToCheck, (err, resultOfQuery) => {
      if (err) {
        console.log("err on selectToCheck", err);
        return res.json({ data: "err", err });
      }
      // resultOfQuery.length > 0 if it was registered before
      // console.log("resultOfQuery.length is " + resultOfQuery.length);

      if (resultOfQuery.length > 0) {
        // previouslyRegisteredData.push(resultOfQuery) collect previously registered
        previouslyRegisteredData.push(resultOfQuery);

        // i == length - 1 at last status
        if (i == length - 1) {
          if (previouslyRegisteredData.length == length) {
            // previouslyRegisteredData.length - 1 == length - 1 are all registered before or not
            return res.json({
              data: "allDataAreRegisteredBefore",
              previouslyRegisteredData,
              date: req.body.dates,
            });
          } else {
            let insert =
              `insert into ${businessName}_Transaction (unitCost,unitPrice,productIDTransaction,salesQty,purchaseQty,registeredTime,wrickages,Inventory)values ` +
              values;
            connection.query(insert, (err, result) => {
              if (err) {
                console.log("err on insert == ", err);
                return res.json({ data: "err", err });
              } else {
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
              }
            });
          }
        } else {
          console.log("recall to recursive");
          i++;
          recurciveTorecheck();
        }
      } else {
        insertedProducts.push(ProductsList[i]);
        let prevInventory = `select * from ${businessName}_Transaction where productIDTransaction='${productID}' and registeredTime<'${req.body.dates}' order by registeredTime desc limit 1`;
        connection.query(prevInventory, (err, results) => {
          if (err) {
            return res.json({ data: "err", err });
          } else {
            if (results.length == 0) {
              // console.log("no data found");
              Inventory = 0;
            } else {
              Inventory = results[0].Inventory;
            }
            Inventory =
              parseInt(rowData[purchaseQty]) -
              parseInt(rowData[salesQuantity]) +
              parseInt(Inventory) -
              parseInt(rowData[wrickageQty]);
            InventoryList.push(Inventory);
            if (values != "") {
              values += ",";
            }
            values += `('${unitCost}','${unitPrice}','${productID}','${rowData[salesQuantity]}','${rowData[purchaseQty]}','${req.body.dates}','${rowData[wrickageQty]}','${Inventory}')`;
          }
          if (i == length - 1) {
            if (previouslyRegisteredData.length == length) {
              // previouslyRegisteredData.length - 1 == length - 1 are all registered before or not
              return res.json({
                data: "allDataAreRegisteredBefore",
                previouslyRegisteredData,
                date: req.body.dates,
              });
            } else {
              console.log(
                "332 InventoryList=",
                InventoryList,
                ", insertedProducts=",
                insertedProducts,
                ", ProductsList=",
                ProductsList
              );
              // return;
              let insert =
                `insert into ${businessName}_Transaction (unitCost,unitPrice,productIDTransaction,salesQty,purchaseQty,registeredTime,wrickages,Inventory)values ` +
                values;
              connection.query(insert, (err, result) => {
                if (err) {
                  console.log("err on insert == ", err);
                  return res.json({ data: "err", err });
                } else {
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
                  });
                }
              });
            }
          } else {
            // increase i by 1
            // recal to recursive
            console.log("recall to recursive");
            i++;
            recurciveTorecheck();
          }
        });
      }
    });
  };
  recurciveTorecheck();
});
server.post(path + "ViewTransactions/", (req, res) => {
  // console.log("/ViewTransactions is === ", req.body);
  // return;
  let businessName = req.body.businessName,
    time = req.body.time;
  let select = `select * from ${businessName}_Transaction,${businessName}_products where ${businessName}_products.productId=${businessName}_Transaction.productIDTransaction and registeredTime like '%${time}%'`;
  // console.log("select is select", select);
  // return;
  let salesTransaction = [],
    expenseTransaction = "";
  connection.query(select, (err, result) => {
    if (err) {
      return res.json({ data: "data is full of err " });
    } else {
      salesTransaction = result;
      let selectCost = `select * from ${businessName}_expenses, ${businessName}_Costs where 
  ${businessName}_expenses.costId=${businessName}_Costs.costsId and costRegisteredDate='${time}'`;
      connection.query(selectCost, (err, results) => {
        if (err) {
          return res.json({ err });
        } else {
          expenseTransaction = results;
          res.json({ expenseTransaction, salesTransaction });
        }
      });
    }
  });
});
server.post(path + "updateTransactions/", async (req, res) => {
  // console.log(req.body);
  let currentInventory = "",
    prevInventory = "";
  let previous = getPreviousDay(new Date(req.body.date));

  let select = `select * from ${req.body.businessName}_Transaction where registeredTime like '%${previous}%' and  transactionId='${req.body.transactionId}'`;
  let update = "";
  let xx = connection.query(select, async (err, result) => {
    if (err) {
      return err;
    } else {
      // console.log("issssssssssssss");
      // console.log(result);
      // console.log(result.length);
      if (result.length > 0) {
        currentInventory = parseInt(req.body.inventory) + prevInventory;
      } else if (result.length == 0) {
        currentInventory =
          parseInt(req.body.purchaseQty) + parseInt(req.body.salesQty);
      }
      update = `update ${req.body.businessName}_Transaction set 
  wrickages='${req.body.broken}',
  purchaseQty='${req.body.purchaseQty}',
  salesQty='${req.body.salesQty}',
  unitCost='${req.body.unitCost}',
  unitPrice='${req.body.unitPrice}',
  Inventory='${currentInventory}',
  description='${req.body.description}'
   where transactionId='${req.body.trasactionId}' `;
      connection.query(update, (err, result) => {
        if (err) return res.json({ err });
        else {
          console.log(result);
        }
      });
      // console.log("currentInventory " + currentInventory);
      return result;
    }
  });

  res.json({ data: req.body });
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
  let businessName = req.body.InputValue.businessName,
    productName = req.body.InputValue.productName,
    toDate = req.body.InputValue.toDate,
    fromDate = req.body.InputValue.fromDate,
    selectSearches = req.body.InputValue.selectSearches;
  // console.log( businessName,toDate, fromDate, " = selectSearches = " + selectSearches  );
  if (selectSearches == "PRODUCTS") {
    let selectProducts = `select * from ${businessName}_products`;
    connection.query(selectProducts, (err, productResults) => {
      if (err) return res.json({ err });
      else {
        res.json({ data: "no results", products: productResults });
      }
    });
  } else if (selectSearches == "TRANSACTION") {
    let select = `select * from ${businessName}_Transaction , ${businessName}_products where productIDTransaction=ProductId and productName like '%${productName}%' and registeredTime between '${fromDate}' and '${toDate}'`;
    connection.query(select, (err, result) => {
      if (err) {
        return res.json({ err });
      }
      if (result) {
        // console.log(result);
        res.json({ data: result, products: "no result" });
      }
    });
  } else if (selectSearches == "ALLTRANSACTION") {
    let select = `select * from ${businessName}_Transaction , ${businessName}_products where productIDTransaction=ProductId and registeredTime between '${fromDate}' and '${toDate}'`;
    let p = new Promise((resolve, reject) => {
      connection.query(select, (err, result) => {
        if (err) {
          reject({ err });
          // return res.json({ err });
        }
        if (result) {
          resolve(result);
        }
      });
    });

    p.then((data) => {
      let getExpences = `select * from ${businessName}_expenses, ${businessName}_Costs where costRegisteredDate  between '${fromDate}' and '${toDate}' and ${businessName}_expenses.costId=${businessName}_Costs.costsId`;
      connection.query(getExpences, (err, results) => {
        if (err) res.json({ err: err });
        if (results) res.json({ expenceTransaction: results, data });
      });

      // res.json({ data });
    }).catch((err) => {
      res.json({ data: err });
    });
  } else if (selectSearches == "COSTS") {
    let selectCost = `select * from ${businessName}_Costs`;
    connection.query(selectCost, (err, costResults) => {
      if (err) {
        console.log("err is", err);
        return res.json({ data: "error 678" });
      } else return res.json({ data: costResults });
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
  let update = `update ${businessName}_products set productsUnitCost='${productCost}', productsUnitPrice='${productPrice}', productName='${productName}', minimumQty='${minimumQty}' where  ProductId='${id}'`;
  connection.query(update, (err, result) => {
    if (err) return res.json({ err });
    if (result) {
      console.log(result);
      res.json({ data: "updated well" });
    }
  });
});
server.post(path + "AddCostItems/", (req, res) => {
  insertIntoCosts(`${req.body.businessName}_Costs`, req.body, res);
  // console.log(req.body);
});
server.post(path + "getCostLists/", (req, res) => {
  // console.log(req.body);
  let select = `select * from ${req.body.businessName}_Costs`;
  connection.query(select, (err, results) => {
    console.log("line 458", results);
    if (err) {
      return res.json({ data: "err", err });
    }
    if (results) {
      res.json({
        data: results,
      });
    }
    //// console.log(businessName);
  });
});
server.post(`/registerCostTransaction/`, (req, res) => {
  // console.log(req.body.businessName);

  let costData = req.body.costData,
    date = req.body.costDate,
    rowData = req.body;

  let Check = `select * from ${req.body.businessName}_expenses where costRegisteredDate='${date}' `;
  connection.query(Check, (err, result) => {
    if (err) return res.json({ err });
    if (result) {
      if (result.length > 0) {
        return res.json({ data: "registered before" });
      } else {
        let i = 0;
        for (; i < costData.length; i++) {
          //  costsId: 1, costName: '9990', unitCost: 890
          // console.log(costData[i]);
          let costsId = costData[i].costsId,
            costName = costData[i].costName;
          costName = costName.replace(/ /g, "");
          let Description = "Description_" + costName;

          let costAmount = rowData[costName],
            costDescription = rowData[Description];
          console.log("@registerCostTransaction ", rowData);
          console.log(
            "costData == ",
            costData,
            "costAmount = " + costAmount,
            " costDescription=" + costDescription
          );
          // return;
          let insert = `insert into ${req.body.businessName}_expenses (costId,costAmount,costDescription,costRegisteredDate) values('${costsId}','${costAmount}','${costDescription}','${date}')`;
          connection.query(insert, (err, result2) => {
            if (err) return res.json({ err });
            else if (result2) {
              // res.json({ data: "Inserted properly" });
              // console.log(result2);
            }
          });
        }
        if (i > 0) return res.json({ data: "Inserted properly" });
        else res.json({ data: "error", error: "unable to insert" });
      }
    }
  });
});
server.post(path + "updateBusiness/", (req, res) => {
  // console.log(req.body);
  // costDescription_: 'ii',
  // costAmount_: '8909',
  // ids: 26,
  // businessName: 'waterBusiness'
  let businessName = req.body.businessName + "_expenses",
    costAmount_ = req.body.costAmount_,
    costDescription_ = req.body.costDescription_;
  let update = `update ${businessName} set costAmount='${costAmount_}',costDescription='${costDescription_}' where expenseId='${req.body.ids}'`;
  connection.query(update, (err, result) => {
    if (err) return res.json({ err });
    if (result)
      // console.log(result);
      res.json({
        data: "updated well",
      });
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
      select = `select * from ${businessName} where productIDTransaction='${productId}' and registeredTime>'${date}' order by registeredTime asc`;
    connection.query(select, (err, results) => {
      if (err) {
        return res.json({ err });
      }
      console.log("select is = ", select, "results are =", results);

      if (results.length > 0) {
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
          let update = `update ${businessName} set inventory='${inventory}' where transactionId=${results[i].transactionId}`;
          // previousInventory = inventory;
          connection.query(update, (err, results1) => {
            if (err) {
              console.log(err);
              return res.json({ err });
            }
            if (results1) {
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
          });
        }
      } else {
        if (index < ProductsList.length - 1) {
          index++;
          recurciveUpdate();
        }
      }
      // return res.json({ data: req.body });
    });
  };
  recurciveUpdate();
};
function insertIntoCosts(businessName, data, res) {
  let check = `select * from ${businessName} where costName='${data.Costname}' `;
  connection.query(check, (err, result1) => {
    if (err) return res.json({ err });
    if (result1.length > 0) {
      return res.json({ data: "already registered before" });
    } else {
      let insert = `insert into ${businessName} (costName) values('${data.Costname}')`;
      connection.query(insert, (err, result) => {
        if (err) return res.json({ err });
        if (result) {
          // console.log(result);
          return res.json({ data: "Registered successfully" });
        }
      });
    }
  });
}
server.post(path + "updateBusinessName/", (req, res) => {
  let businessName = req.body.businessname,
    targetBusinessId = req.body.targetBusinessId;
  let veifyName = `select * from Business where businessName='${businessName}' and  businessId!='${targetBusinessId}'`;
  connection.query(veifyName, (err, results) => {
    if (err) {
      res.json({ data: "error", err });
    } else if (results) {
      if (results.length > 0) {
        return res.json({ data: "reservedByOtherBusiness", results });
      } else {
        let oldBusinessName = "";
        let getOldtableName = `select * from Business where businessId='${targetBusinessId}'`;
        connection.query(getOldtableName, (err, results) => {
          if (err) return res.json({ err });
          if (results) {
            // console.log(results);
            oldBusinessName = results[0].BusinessName;
            // res.json({ data: `${oldBusinessName}_products`, results });
            // return;
            let alter_products = `ALTER TABLE  ${oldBusinessName}_products RENAME TO ${businessName}_products`;
            connection.query(alter_products, (err, result) => {
              if (err) {
                console.log(err);
                // return res.json({ err });
              }
              if (result) console.log(result);
            });

            let alter_expenses = `ALTER TABLE ${oldBusinessName}_expenses RENAME TO ${businessName}_expenses`;
            connection.query(alter_expenses, (err, result) => {
              if (err) {
                // return res.json({ err });
                console.log(err);
              }
              if (result) console.log(result);
            });
            let alter_transaction = `ALTER TABLE ${oldBusinessName}_Transaction RENAME TO ${businessName}_Transaction`;
            connection.query(alter_transaction, (err, result) => {
              if (err) return res.json({ err });
              if (result) console.log(result);
            });
            let alter_Costs = `ALTER TABLE ${oldBusinessName}_Costs RENAME TO ${businessName}_Costs`;
            connection.query(alter_Costs, (err, result) => {
              if (err) {
                console.log(err);
                return res.json({ err });
              }
              if (result) {
                console.log(result);
              }

              let update = `update Business set businessName='${businessName}' where businessId='${targetBusinessId}'`;
              // { businessname: 'waterBusiness', targetBusinessId: 37 }

              connection.query(update, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json({ err });
                }
                if (result) {
                  // console.log(result);
                }
              });
            });
            res.json({ data: "update is successfull" });
          }
        });
      }
    }
  });

  //////////////////
});
server.post(path + "searchEmployee/", (req, res) => {
  console.log("searchEmployee", req.body);
  // return;
  let employeeNameToBeSearched = req.body.employeeNameToBeSearched,
    businessId = req.body.businessId;
  let select = `select  * from usersTable where  (phoneNumber like '%${employeeNameToBeSearched}%' or employeeName like '%${employeeNameToBeSearched}%')`;
  // select in select or nested select will be our target goal to get employees
  connection.query(select, async (err, result) => {
    if (err) return res.json({ err });
    if (result) {
      let sql = `select * from usersTable,employeeTable where  (phoneNumber like '%${employeeNameToBeSearched}%' or employeeName like '%${employeeNameToBeSearched}%')  and  BusinessIDEmployee=${businessId} and userIdInEmployee=userId`;
      connection.query(sql, (err, results1) => {
        if (err) console.log(err);
        else if (results1) res.json({ data: { result, results1 } });
      });
    }
  });
  // console.log(req.body);
  // connection.query(select);
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

  let check = `select * from employeeTable,Business where userIdInEmployee=${userId} and BusinessID=${businessId} and BusinessIDEmployee=BusinessID`;
  connection.query(check, (err, response) => {
    if (err) return res.json({ err });
    if (response) {
      //
      if (response.length > 0) {
        res.json({ data: "data is already registered bofore" });
      } else {
        let insert = `insert into employeeTable(userIdInEmployee,BusinessIDEmployee,employerId)values('${userId}','${businessId}',${employerId})`;
        connection.query(insert, (err, result) => {
          if (err) return res.json({ err });
          if (result) {
            //
            res.json({ data: "data is inserted correctly." });
            // console.log(result);
          }
        });
      }
    }
    // console.log(response);
  });
  return;
});
server.post(path + "getBusinessEmployee/", (req, res) => {
  // console.log(req.body);
  console.log("req.body.businessId " + req.body.businessId);
  let select = `select 
    employeeId,
    userIdInEmployee,
    BusinessIDEmployee,
    BusinessID,
    BusinessName,
    createdDate,
    ownerId,
    status,
    userId,
    phoneNumber,
    employeeName from employeeTable,Business,usersTable where userId=userIdInEmployee and BusinessIDEmployee=BusinessID and BusinessID='${req.body.businessId}'`;
  connection.query(select, (Error, response) => {
    if (Error) {
      console.log(Error);
      res.json({ data: response, error: "error to get employees" });
    }
    if (response) {
      console.log("response", response);

      res.json({ data: response });
    }
  });
});
server.post(path + "removeEmployees/", (req, res) => {
  // console.log(req.body);
  let deleteEmployee = `delete from employeeTable where employeeId='${req.body.employeeId}'`;
  connection.query(deleteEmployee, (err, results) => {
    if (err) {
      return res.json({ err });
      return;
    }
    res.json({ Status: "deleted", EmployeeId: req.body.employeeId });
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
  let selectProduct = `select * from ${businessName}_products where productName like '%${productName}%'`;
  connection.query(selectProduct, (error, results) => {
    if (error) {
      return res.json({ data: "error 400" });
      // console.log(error);
    } else {
      // console.log("results");
      // console.log(results);
      res.json({ data: results });
    }
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
  if (productId == "getAllTransaction") {
    getTransaction = `select * from dailyTransaction,${businessName}_products where businessId='${businessId}' and registrationDate='${currentDates}' and (${businessName}_products.ProductId=dailyTransaction.ProductId)`;
  } else
    getTransaction = `select * from dailyTransaction,${businessName}_products where businessId='${businessId}' and dailyTransaction.ProductId='${productId}' and registrationDate='${currentDates}' and (${businessName}_products.ProductId=dailyTransaction.ProductId)`;

  // res.json({ data: productId });
  // return;
  connection.query(getTransaction, (err, result) => {
    if (err) return res.json({ err });
    if (result) {
      // console.log(result);
      res.json({ data: result });
    }
  });
});
server.post(path + "deleteBusines/", async (req, res) => {
  // console.log(req.body);
  // businessName: 'Marew', businessId: 1
  deleteBusiness(req.body.businessId, req.body.businessName, res);
  // console.log("responce is === ", responce);
  // res.json({ data: responce });
});
server.post(path + "getMyProfile/", async (req, res) => {
  let userId = await Auth(req.body.myToken);
  console.log("userId", userId);
  let select = `select * from usersTable where userId=${userId}`;
  connection.query(select, (err, results) => {
    if (err) res.json({ data: "error No 5" });
    else res.json({ data: results });
  });
  // res.json({ data: userId });
});
server.post(path + "updateUsers", async (req, res) => {
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
  let Select = `select * from usersTable where userId='${userID}'`;
  connection.query(Select, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ data: "error 06" });
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
  {
    CostName_: "others";
    CostValue_: "890";
  }
  let businessName = req.body.businessName,
    Token = req.body.Token,
    CostName_ = req.body.CostName_,
    CostValue_ = req.body.CostValue_,
    costsId = req.body.costsId;
  // let id = await Auth(Token);
  let update = `update ${businessName}_Costs set costName='${CostName_}',
    unitCost='${CostValue_}' where costsId=${costsId}`;
  connection.query(update, (error, results) => {
    if (error) res.json({ data: error });
    if (results) res.json({ data: "updated successfully", results });
  });
});
server.post(path + "updateMyexpencesList/", async (req, res) => {
  // ExpId: 1;
  // amount: "900";
  // businessName: "waterBusiness";
  // description: "8989";
  let businessName = req.body.businessName,
    description = req.body.description,
    amount = req.body.amount,
    ExpId = req.body.ExpId,
    exp = `update ${businessName}_expenses set costDescription='${description}',costAmount='${amount}' where expenseId='${ExpId}'`;
  connection.query(exp, (err, results) => {
    if (err) {
      console.log(err);
      res.json({ data: "err 501.1" });
    }
    if (results) {
      console.log(results);
      res.json({ data: "updated" });
    }
  });
});

server.post(path + "deleteSales_purchase/", async (req, res) => {
  let transactionId = req.body.transactionId;
  let businessName = req.body.businessName;
  let Delet = `delete from ${businessName}_Transaction where transactionId=${transactionId}`;
  let x = await Auth(req.body.token);
  // ownerId;BusinessName;
  let verify = `select * from Business where BusinessName='${businessName}' and ownerId='${x}' `;
  connection.query(verify, (err, responce) => {
    if (err) {
      console.log(err);
      res.json({ data: err, err });
    } else {
      console.log(responce);
      if (responce.length > 0) {
        // res.json({ data: responce });
        connection.query(Delet, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({ data: err, err });
          } else {
            return res.json({ data: "deleted", results });
          }
        });
      } else res.json({ data: "NotAllowedByYou" });
      return;
    }
  });
});
server.post(path + "deleteCostData", async (req, res) => {
  // businessName: "waterBusiness";
  // costName: "taxi";
  // costsId: 1;
  // unitCost: 100;
  let businessName = req.body.businessName,
    costsId = req.body.costsId,
    Token = req.body.Token;
  let userId = await Auth(Token);
  let select = `select * from Business where BusinessName= '${businessName}' and ownerId ='${userId}'`;
  connection.query(select, (err, responce) => {
    if (err) console.log(err);
    if (responce.length > 0) {
      let deleteCostItem = `delete from ${businessName}_Costs where costsId='${costsId}'`;
      connection.query(deleteCostItem, (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.json({ data: "deleted" });
        }
        console.log(results);
      });
    } else {
      res.json({ data: "youAreNotAllowed" });
    }
  });
});
server.post(path + "GetMinimumQty/", (req, res) => {
  let token = req.body.token,
    businessName = req.body.businessName,
    select = `select * from ${businessName}_Transaction,${businessName}_products where productIDTransaction=ProductId order by registeredTime desc limit 1`;

  connection.query(select, (err, results) => {
    if (err) {
      console.log(err);

      res.json({ data: "err", err });
    }
    if (results) {
      res.json({ data: results });
      console.log("@GetMinimumQty ", results);
    }
  });
  // res.json({ data: req.body });
});
server.post(path + "getMaximumSales/", (req, res) => {
  let DateRange = req.body.DateRange,
    fromDate = DateRange.fromDate,
    toDate = DateRange.toDate,
    businessName = req.body.businessName,
    token = req.body.token;
  let select = `select * from ${businessName}_products, ${businessName}_Transaction where  ProductId = productIDTransaction and registeredTime between '${toDate}' and '${fromDate}'`;
  connection.query(select, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ data: "err", err });
    }
    if (results) {
      console.log(results);
      return res.json({ data: results });
    }
  });
  // res.json({ data: req.body });
});
server.post(path + "removeEmployeersBusiness/", async (req, res) => {
  // return res.json({ data: req.body });
  let userID = await Auth(req.body.token);
  let getEmployeerBusiness = `select * from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
  connection.query(getEmployeerBusiness, (err, results) => {
    if (err) console.log(err);
    // res.json({ data: results });
    if (results.length > 0) {
      let deleteData = `delete from employeeTable where userIdInEmployee='${userID}' and BusinessIDEmployee='${req.body.BusinessID}'`;
      connection.query(deleteData, (error, resultsOfSelect) => {
        if (error) {
          console.log(error);
          return res.json({ data: error, error });
        }
        if (resultsOfSelect) {
          return res.json({ data: resultsOfSelect });
        } else return res.json({ data: "alreadyDeleted" });
      });
    } else {
      res.json({ data: "NoDataLikeThis" });
    }
  });
});
