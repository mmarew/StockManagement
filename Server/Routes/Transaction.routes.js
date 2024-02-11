const express = require("express");
const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const path = "/";
const { DateFormatter, isValidDateFormat } = require("../DateFormatter");
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");
const {
  registerSinglesalesTransaction,
  getDailyTransaction,
  deleteDailyTransactionController,
  updateDailyTransactionsController,
  getSingleItemsTransactionController,
  getMultipleItemsTransactionController,
  getBusinessTransactionsController,
  deleteSales_purchaseController,
  registerTransactionController,
  ViewTransactionsController,
  updateTransactionsController,
} = require("../Controllers/Transaction.Controller");
const router = express.Router();
require("dotenv").config();
const tokenKey = process.env.tokenKey;
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

        pool.query(sqlToSelect, inputToSelect).then(([rows]) => {
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

        let select = `SELECT * FROM ?? WHERE mainProductId=? AND 
         registeredTime>? ORDER BY  registeredTime  ASC`;
        let values = [businessName, mainProductId, date];
        try {
          const [rows] = await pool.query(select, values);

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
                await pool.query(update, valuesToUpdate).then((results) => {
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
let updateNextInventory = async ({
  dailySalesId,
  mainProductId,
  businessId,
  inventoryItem,
  userID,
  ProductId,
  registeredTimeDaily,
}) => {
  try {
    let sqlToGetNextInventori = `select * from dailyTransaction where  mainProductId=? and businessId=? and registeredTimeDaily>? and dailySalesId !=? order by registeredTimeDaily, dailySalesId asc`;
    let values = [mainProductId, businessId, registeredTimeDaily, dailySalesId];
    let uniqueBusinessName = await getUniqueBusinessName(businessId, userID);
    if (
      uniqueBusinessName == "you are not owner of this business" ||
      uniqueBusinessName == "Error"
    ) {
      return { data: "you are not owner of this business" };
    }

    let [nextResult] = await pool.query(sqlToGetNextInventori, values);

    let updates = async (Result) => {
      let { purchaseQty, salesQty, creditsalesQty, brokenQty, dailySalesId } =
        Result;
      inventoryItem =
        Number(inventoryItem) +
        Number(purchaseQty) -
        Number(salesQty) -
        Number(creditsalesQty) -
        Number(brokenQty);
      let id = Result.dailySalesId;

      let update = `update dailyTransaction set inventoryItem='${inventoryItem}',reportStatus='unreported to total sales' where dailySalesId='${id}'`;
      let MyUpdate = await pool.query(update);
      /////////////////// => yy-mm-dd-hh-m-s
      let deleteFromTotalSales = `delete from ${uniqueBusinessName}_Transaction where productIDTransaction='${ProductId}' and registeredTime='${DateFormatter(
        registeredTimeDaily
      )}'`;
      pool.query(deleteFromTotalSales);
    };
    nextResult.map(async (Result, index) => {
      // console.log("nextResult is ", Result);
      await updates(Result);
    });
  } catch (error) {
    console.log("error", error);
  }
};

router.put(
  "/Transaction/updateDailyTransactions",
  authMiddleware,
  updateDailyTransactionsController
);

// Transaction;
router.post(
  "/Transaction/registerSinglesalesTransaction",
  authMiddleware,
  registerSinglesalesTransaction
);
router.post(
  "/Transaction/getDailyTransaction",
  authMiddleware,
  getDailyTransaction
);
router.post(
  "/Transaction/deleteDailyTransaction",
  authMiddleware,
  authMiddleware2,
  deleteDailyTransactionController
);
router.get(
  "/getSingleItemsTransaction",
  authMiddleware,
  getSingleItemsTransactionController
);

router.get(
  "/getMultipleItemsTransaction",
  authMiddleware,
  getMultipleItemsTransactionController
);
router.get(
  "/getBusinessTransactions",
  authMiddleware,
  getBusinessTransactionsController
);
router.post(
  path + "deleteSales_purchase/",
  authMiddleware,
  authMiddleware2,
  deleteSales_purchaseController
);
router.post(
  path + "registerTransaction/",
  authMiddleware,
  registerTransactionController
);

router.post(
  path + "ViewTransactions/",
  authMiddleware,
  ViewTransactionsController
);
router.post(
  path + "updateTransactions/",
  authMiddleware,
  updateTransactionsController
);
module.exports = router;
