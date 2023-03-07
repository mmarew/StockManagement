import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import Auth from "./Auth.js";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import createBasicTables from "./Database.js";
let date = new Date();
let fullTime =
  date.getFullYear() +
  "/" +
  (date.getMonth() + 1) +
  "/" +
  date.getDate() +
  " " +
  date.getHours() +
  ":" +
  date.getMinutes() +
  ":" +
  date.getSeconds();
console.log("fullTime is " + fullTime);
let server = express();
createBasicTables();
import jwt from "jsonwebtoken";
import Database, {
  insertIntoUserTable,
  connection,
  createBusiness,
} from "./Database.js";
server.listen(process.env.serverPort, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected at 2020 ");
  }
});
server.use(cors()); // if you want to use every domain
const corsOption = {
  origin: ["http://localhost:3000"],
};
server.use(cors(corsOption));
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
server.get("/", (req, res) => {
  console.log(req.body);
  //    console.log(res);
  res.end("it is server");
});
server.post("/getBusiness", (req, res) => {
  // console.log(req.body.token);
  let Tokens = req.body.token;
  if (Tokens == "" || Tokens == undefined) {
    return res.json({ data: "You haven't loged in before." });
  }
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let getBusiness = `select * from business where ownerId='${userID}'`;
  let myBusiness = "",
    employeerBusiness = "";
  connection.query(getBusiness, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("getBusiness");
      console.log(result);
      myBusiness = result;
    }
    let getEmployeerBusiness = `select * from employeeTable , business where userIdInEmployee='${userID}' 
    and business.BusinessID=employeetable.BusinessIDEmployee`;
    connection.query(getEmployeerBusiness, (err, results) => {
      if (err) console.log(err);
      if (result) {
        employeerBusiness = results;
        console.log("employeerBusiness = " + employeerBusiness);
        console.log("userID " + userID);
      }
      console.log(
        "myBusiness, employeerBusiness " + myBusiness,
        employeerBusiness
      );

      res.json({ myBusiness, employeerBusiness });
    });
  });
});
server.post("/verifyLogin", (req, res) => {
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let select = `select * from userstable where userId='${userID}'`;
  connection.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      if (result.length > 0) {
        return res.json({ data: "alreadyConnected" });
      } else {
        return res.json({ data: "dataNotFound" });
      }
    }
  });
  // res.json({ data: "connection" });
});
server.post("/Login", (req, res) => {
  console.log(req.body);
  let select = `select * from userstable where phoneNumber='${req.body.phoneNumber}' limit 1`;
  connection.query(select, (err, result) => {
    if (result.length == 0) {
      return res.json({ data: "data not found" });
    } else {
      console.log(result[0].password);
    }
    let savedPassword = result[0].password;
    const isMatch = bcrypt.compareSync(req.body.Password, savedPassword);
    console.log(isMatch);

    let token = jwt.sign({ userID: result[0].userId }, "shhhhh");

    if (isMatch) {
      return res.json({ data: "loginSuccessFull", token });
    } else {
      return res.json({ data: "password mismatch" });
    }
  });
  // res.json({ data: "connected" });
});
server.post("/RegisterUsers", async (req, res) => {
  let registerPhone = req.body.registerPhone,
    registerPassword = req.body.registerPassword,
    fullName = req.body.fullName;
  let results = await insertIntoUserTable(
    fullName,
    registerPhone,
    registerPassword,
    res
  );
  console.log("results is " + results);
});
server.post("/addProducts", async (req, res) => {
  let rowData = req.body,
    productName = rowData.productName,
    productPrice = rowData.productUnitPrice,
    productCost = rowData.productUnitCost,
    businessId = rowData.businessId,
    userId = await Auth(rowData.token),
    businessName = "";
  let select = `select * from  business where businessId=${businessId}`;
  connection.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      businessName = result[0].BusinessName;
      console.log("result[0]");
      console.log(result);

      console.log(result[0].ownerId);
      if (result[0].ownerId !== userId) {
        res.json({ data: "notAllowedFroYou" });
        return;
      }
      let selectProduct = `select productName from ${businessName}_products where productName='${productName}'`;
      connection.query(selectProduct, (err, result) => {
        if (err) return console.log(err);
        if (result.length == 0) {
          let Insert = `insert into ${businessName}_products(productsUnitCost,productsUnitPrice,productName)values('${productCost}','${productPrice}','${productName}')`;
          connection.query(Insert, (err, result) => {
            if (err) console.log(err);
            if (result) {
              console.log(result);
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
server.post("/createBusiness", (req, res) => {
  let businessName = req.body.businessName;
  let decoded = jwt.verify(req.body.token, "shhhhh");
  let userID = decoded.userID;
  let response = createBusiness(businessName, userID, fullTime, res);
  console.log(response);
  // res.json({ data: response });
});
server.post("/getRegisteredProducts", async (req, res) => {
  console.log(req.body.BusinessId, req.body.token, req.body.businessName);
  let select = `select * from ${req.body.businessName}_products`;
  connection.query(select, (err, result) => {
    if (err) console.log(err);
    if (result) console.log(result);
    res.json({ data: result });
  });
  // let userId = await Auth(req.body.token);
  // res.end("getRegisteredProducts lllllllllll");
});
server.post("/registerTransaction", async (req, res) => {
  let rowData = req.body,
    ProductsList = rowData.ProductsList,
    businessName = rowData.businessName;
  // check if it was registered before on this date
  let selectToCheck = `select * from  ${businessName}_transaction where registeredTime like '%${req.body.dates}%'`;
  console.log(
    "businessName " + businessName,
    " req.body.dates = " + req.body.dates
  );
  connection.query(selectToCheck, async (err, results) => {
    if (err) console.log(err);
    console.log("First check it out ");
    console.log(results);
    // return;
    if (results.length > 0) {
      console.log("greater than it ");
      return res.json({ data: "This is already registered" });
    } else {
      console.log("results = " + results);
      let values = "";
      for (let i = 0; i < ProductsList.length; i++) {
        let productID = ProductsList[i].ProductId,
          unitCost = ProductsList[i].productsUnitCost,
          unitPrice = ProductsList[i].productsUnitPrice,
          salesQuantity = "salesQuantity" + productID,
          purchaseQty = "purchaseQty" + productID,
          wrickageQty = "wrickageQty" + productID;
        console.log(
          rowData[salesQuantity],
          rowData[purchaseQty],
          rowData[wrickageQty]
        );
        // let prevDay = await getPreviousDay(new Date(req.body.dates));
        // console.log("prevDay = " + prevDay);
        let Inventory = 0;

        let prevInventory = `select * from ${businessName}_transaction where productIDTransaction='${productID}' and registeredTime<'${req.body.dates}' order by registeredTime desc limit 1 `;
        connection.query(prevInventory, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results.length == 0) {
              console.log("no data found");
            } else {
              Inventory = results[0].Inventory;
            }
            Inventory =
              parseInt(rowData[purchaseQty]) -
              parseInt(rowData[salesQuantity]) +
              parseInt(Inventory) -
              parseInt(rowData[wrickageQty]);

            console.log(Inventory);

            if (i > 0) {
              values += ",";
            }
            values += `('${unitCost}','${unitPrice}','${productID}','${rowData[salesQuantity]}','${rowData[purchaseQty]}','${req.body.dates}','${rowData[wrickageQty]}','${Inventory}')`;

            let insert =
              `insert into ${businessName}_transaction (unitCost,unitPrice,productIDTransaction,salesQty,purchaseQty,registeredTime,wrickages,Inventory)values ` +
              values;
            if (i == ProductsList.length - 1)
              connection.query(insert, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log(result);
                  updateNextDateInventory(
                    `${businessName}_transaction`,
                    productID,
                    req.body.dates,
                    Inventory
                  );

                  return res.json({ data: "data is registered successfully" });
                }
              });
          }
        });
      }
    }
  });
});
server.post("/ViewTransactions", (req, res) => {
  console.log(req.body);
  let businessName = req.body.businessName,
    time = req.body.time;
  let select = `select * from ${businessName}_transaction,${businessName}_products where ${businessName}_products.productId=${businessName}_transaction.productIDTransaction and registeredTime like '%${time}%'`;
  let salesTransaction = "",
    expenseTransaction = "";
  connection.query(select, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ data: "data is full of err " });
    } else {
      console.log(result);
      salesTransaction = result;
      // res.json({ data: result });

      let selectCost = `select * from ${businessName}_expenses, ${businessName}_costs where 
  ${businessName}_expenses.costId=${businessName}_costs.costsId and costRegisteredDate='${time}'`;
      connection.query(selectCost, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log(results);
          expenseTransaction = results;
          res.json({ expenseTransaction, salesTransaction });
        }
      });
    }
  });
});
server.post("/updateTransactions", async (req, res) => {
  console.log(req.body);
  let currentInventory = "",
    prevInventory = "";
  let previous = getPreviousDay(new Date(req.body.date));
  // prevInventory = getInventory(
  //   previous,
  //   req.body.businessName + "_transaction",
  //   52
  // );
  let select = `select * from ${req.body.businessName}_transaction where registeredTime like '%${previous}%' and  transactionId='${req.body.transactionId}'`;
  let update = "";
  let xx = await connection.query(select, async (err, result) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("issssssssssssss");
      console.log(result);
      console.log(result.length);
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
        if (err) console.log(err);
        else {
          console.log(result);
        }
      });
      console.log("currentInventory " + currentInventory);
      return result;
    }
  });

  res.json({ data: req.body });
});
async function getPreviousDay(date) {
  const previous = await new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  let previousFormat = new Date(previous),
    previousDay = "";
  previousDay =
    previousFormat.getFullYear() +
    "-0" +
    (previousFormat.getMonth() + 1) +
    "-" +
    previousFormat.getDate();
  console.log("previousDay = " + previousDay);

  return previousDay;
}
server.post("/searchProducts", (req, res) => {
  console.log(req.body.InputValue);
  // {
  //   businessName: 'marew_masresha_abate',
  //   toDate: '2023-02-21',
  //   fromDate: '2023-02-15',
  //   selectSearches: 'TRANSACTION',
  //   productName: 'pppppp'
  // }

  let businessName = req.body.InputValue.businessName,
    productName = req.body.InputValue.productName,
    toDate = req.body.InputValue.toDate,
    fromDate = req.body.InputValue.fromDate,
    selectSearches = req.body.InputValue.selectSearches;
  console.log(
    businessName,
    toDate,
    fromDate,
    " = selectSearches = " + selectSearches
  );
  if (selectSearches == "PRODUCTS") {
    let selectProducts = `select * from ${businessName}_products`;
    connection.query(selectProducts, (err, productResults) => {
      if (err) console.log(err);
      else {
        res.json({ data: "no results", products: productResults });
      }
    });
  } else if (selectSearches == "TRANSACTION") {
    let select = `select * from ${businessName}_transaction , ${businessName}_products where productIDTransaction=ProductId and productName like '%${productName}%' and registeredTime between '${fromDate}' and '${toDate}'`;
    connection.query(select, (err, result) => {
      if (err) console.log(err);
      if (result) {
        console.log(result);
        res.json({ data: result, products: "no result" });
      }
    });
  } else {
    res.json({ data: "Bad request.", products: "Bad request" });
  }
});

server.post("/updateProducts", (req, res) => {
  console.log(req.body);
  let productPrice = req.body.productPrice,
    productName = req.body.productName,
    productCost = req.body.productCost,
    businessName = req.body.businessName,
    id = req.body.id;
  let update = `update ${businessName}_products set productsUnitCost='${productCost}', productsUnitPrice='${productPrice}', productName='${productName}' where  ProductId='${id}'`;
  connection.query(update, (err, result) => {
    if (err) console.log(err);
    if (result) console.log(result);
  });
  res.json({ data: "updated well" });
});
server.post("/AddCostItems", (req, res) => {
  insertIntoCosts(`${req.body.businessName}_Costs`, req.body, res);
  console.log(req.body);
});
server.post("/getCostLists", (req, res) => {
  console.log(req.body);
  let select = `select * from ${req.body.businessName}_costs`;
  connection.query(select, (err, results) => {
    if (err) {
      console.log(err);
      res.json({
        data: "error " + 55,
      });
    }
    if (results) {
      res.json({
        data: results,
      });
      console.log(results);
    }
    // console.log(businessName);
  });
});
server.post(`/registerCostTransaction`, (req, res) => {
  console.log(req.body.businessName);

  let costData = req.body.costData,
    date = req.body.costDate,
    rowData = req.body;
  let Check = `select * from ${req.body.businessName}_expenses where costRegisteredDate='${date}' `;
  connection.query(Check, (err, result) => {
    if (err) console.log(err);
    if (result) {
      console.log("costDatecostDatecostDatecostDatecostDate");
      console.log(result);
      console.log("date is " + date);
      if (result.length > 0) {
        return res.json({ data: "registered before" });
      } else {
        let i = 0;
        for (; i < costData.length; i++) {
          //  costsId: 1, costName: '9990', unitCost: 890
          console.log(costData[i]);
          let costsId = costData[i].costsId,
            costName = costData[i].costName,
            Description = "Description_" + costName;
          console.log("Description is " + Description);
          let costAmount = rowData[costName],
            costDescription = rowData[Description];
          console.log(
            "costAmount = " + costAmount,
            " costDescription=" + costDescription
          );
          let insert = `insert into ${req.body.businessName}_expenses (costId,costAmount,costDescription,costRegisteredDate) values('${costsId}','${costAmount}','${costDescription}','${date}')`;
          connection.query(insert, (err, result2) => {
            if (err) console.log(err);
            else if (result2) {
              // res.json({ data: "Inserted properly" });
              console.log(result2);
            }
          });
        }
        return res.json({ data: "Inserted properly" });
      }
    }
  });
});
server.post("/updateBusiness", (req, res) => {
  console.log(req.body);
  // costDescription_: 'ii',
  // costAmount_: '8909',
  // ids: 26,
  // businessName: 'waterBusiness'
  let businessName = req.body.businessName + "_expenses",
    costAmount_ = req.body.costAmount_,
    costDescription_ = req.body.costDescription_;
  let update = `update ${businessName} set costAmount='${costAmount_}',costDescription='${costDescription_}' where expenseId='${req.body.ids}'`;
  connection.query(update, (err, result) => {
    if (err) console.log(update);
    if (result) console.log(result);
    res.json({
      data: "updated well",
    });
  });
});
let updateNextDateInventory = (
  businessName,
  productId,
  date,
  previousInventory
) => {
  console.log(
    `businessName, productId, date, previousInventory = ` + businessName,
    productId,
    date,
    previousInventory
  );

  let select = `select * from ${businessName} where productIDTransaction='${productId}' and registeredTime>'${date}' order by registeredTime asc`;
  connection.query(select, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      console.log("it is ok");
      // use for loop
      console.log(results);

      for (let i = 0; i < results.length; i++) {
        let salesqty = results[i].salesQty,
          purchaseQty = results[i].purchaseQty,
          inventory = 0,
          wrickages = results[i].wrickages;
        inventory = purchaseQty + previousInventory - salesqty - wrickages;
        console.log(" inventory is @ " + i + " " + inventory);
        // return;
        let update = `update ${businessName} set inventory='${inventory}' where transactionId=${results[i].transactionId}`;
        previousInventory = inventory;
        connection.query(update, (err, results1) => {
          console.log("results1 is " + results1.length);
          console.log(results1);
          if (err) {
            console.log(err);
          }
          if (results1) {
            console.log("updated " + results1);
          } else {
          }
        });
      }
    } else {
    }
    // return res.json({ data: req.body });
  });
};
function insertIntoCosts(businessName, data, res) {
  console.log("businessName " + businessName);
  console.log("datas=", data);
  //  costName varchar(3000),unitCost
  let check = `select * from ${businessName} where costName='${data.Costname}' `;
  connection.query(check, (err, result1) => {
    if (err) console.log(err);
    if (result1.length > 0) {
      return res.json({ data: "already registered before" });
    } else {
      let insert = `insert into ${businessName} (costName,unitCost) values('${data.Costname}','${data.costPrice}')`;
      connection.query(insert, (err, result) => {
        if (err) console.log(err);
        if (result) {
          console.log(result);
          return res.json({ data: "Registered successfully" });
        }
      });
    }
  });
}
server.post("/updateBusinessName", (req, res) => {
  console.log(req.body);
  let businessName = req.body.businessname,
    targetBusinessId = req.body.targetBusinessId;
  console.log("businessName", businessName);
  let oldBusinessName = "";
  let getOldtableName = `select * from business where businessId='${targetBusinessId}'`;
  connection.query(getOldtableName, (err, results) => {
    if (err) console.log(err);
    if (results) {
      console.log(results);
      oldBusinessName = results[0].businessName;
    }
    // RENAME Cars To Car_2021_Details ;
    // ALTER TABLE Student RENAME TO MCA_Student_Details ;
    let alter_products = `ALTER TABLE  ${oldBusinessName}_products RENAME TO ${businessName}_products`;
    connection.query(alter_products, (err, result) => {
      if (err) console.log(err);
      if (result) console.log(result);
    });

    let alter_expenses = `ALTER TABLE ${oldBusinessName}_expenses RENAME TO ${businessName}_expenses`;
    connection.query(alter_expenses, (err, result) => {
      if (err) console.log(err);
      if (result) console.log(result);
    });
    let alter_transaction = `ALTER TABLE ${oldBusinessName}_transaction RENAME TO ${businessName}_transaction`;
    connection.query(alter_transaction, (err, result) => {
      if (err) console.log(err);
      if (result) console.log(result);
    });
    let alter_costs = `ALTER TABLE ${oldBusinessName}_costs RENAME TO ${businessName}_costs`;
    connection.query(alter_costs, (err, result) => {
      if (err) console.log(err);
      if (result) console.log(result);
    });
  });

  let update = `update business set businessName='${businessName}' where businessId='${targetBusinessId}'`;
  // { businessname: 'waterBusiness', targetBusinessId: 37 }
  connection.query(update, (err, result) => {
    if (err) console.log(err);
    if (result) {
      console.log(result);
    }
  });
  res.json({ data: "update is successfull" });
});
server.post("/searchEmployee", (req, res) => {
  let employeeNameToBeSearched = req.body.employeeNameToBeSearched;
  let select = `select userId,employeeName,phoneNumber from userstable where  phoneNumber like '%${employeeNameToBeSearched}%' or employeeName like '%${employeeNameToBeSearched}%'`;
  connection.query(select, (err, result) => {
    if (err) console.log(err);
    if (result) {
      res.json({ data: result });
      console.log("search employeee ");
      console.log(result);
    }
  });
  console.log(req.body);
  // connection.query(select);
});
server.post("/addEmployee", (req, res) => {
  let rowData = req.body,
    name = rowData.name,
    phone = rowData.phone,
    businessId = rowData.businessId,
    userId = rowData.userId;
  console.log("rowData is ");
  console.log(rowData);

  let check = `select * from employeeTable,business where userIdInEmployee=${userId} and BusinessID=${businessId} and BusinessIDEmployee=BusinessID`;
  connection.query(check, (err, response) => {
    if (err) console.log(err);
    if (response) {
      if (response.length > 0) {
        res.json({ data: "data is already registered bofore" });
      } else {
        let insert = `insert into employeeTable(userIdInEmployee,BusinessIDEmployee)values('${userId}','${businessId}')`;
        connection.query(insert, (err, result) => {
          if (err) console.log(err);
          if (result) {
            res.json({ data: "data is inserted correctly." });
            console.log(result);
          }
        });
      }
    }
    console.log(response);
  });
  return;
});
server.post("/getBusinessEmployee", (req, res) => {
  console.log(req.body);
  console.log("req.body.businessId " + req.body.businessId);
  let select = `select * from employeetable,userstable where userId=userIdInEmployee and BusinessID='${req.body.businessId}'`;
  connection.query(select, (Error, response) => {
    if (Error) {
      console.log(Error);
    }
    if (response) {
      console.log(response);
      res.json({ data: response });
    }
  });
});
server.post("/removeEmployees", (req, res) => {
  console.log(req.body);
  let deleteEmployee = `delete from employeetable where employeeId='${req.body.employeeId}'`;
  connection.query(deleteEmployee, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json({ Status: "deleted", EmployeeId: req.body.employeeId });
    console.log(results);
  });
});
server.post("/registerEmployeersProducts", (req, res) => {
  let TranactionProducts = req.body.tranactionProducts,
    EmployeersProduct = req.body.EmployeersProduct;
  console.log(
    "TranactionProducts = ",
    TranactionProducts,
    "EmployeersProduct = ",
    EmployeersProduct
  );
  let ProductId = EmployeersProduct[0].ProductId;
  //  { purchase_1: '456', sales_1: '400', Wrickage_1: '6' }
  let purchase_ = "purchase_" + ProductId,
    sales_ = "sales_" + ProductId,
    Wrickage_ = "Wrickage_" + ProductId;
  console.log("EmployeersProduct[0]", EmployeersProduct[0]);
  console.log();
  let purchaseQty = TranactionProducts[purchase_],
    salesQty = TranactionProducts[sales_],
    wrickageQty = TranactionProducts[Wrickage_];
  console.log(purchaseQty, salesQty, wrickageQty);
  let insert = `insert into `;
  res.json({ data: req.body });
});
