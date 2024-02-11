const { pool } = require("../Config/db.config");
const { isValidDateFormat } = require("../DateFormatter");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { validateAlphabet } = require("../Utility/validateAlphabet");
const updateNextInventory = async ({
  dailySalesId,
  mainProductId,
  businessId,
  inventoryItem,
  userID,
  ProductId,
  registeredTimeDaily,
}) => {
  try {
    const sqlToGetNextInventory = `SELECT * FROM dailyTransaction WHERE mainProductId=? AND businessId=? AND registeredTimeDaily>? AND dailySalesId !=? ORDER BY registeredTimeDaily, dailySalesId ASC`;
    const values = [
      mainProductId,
      businessId,
      registeredTimeDaily,
      dailySalesId,
    ];
    const uniqueBusinessName = await getUniqueBusinessName(businessId, userID);

    if (
      uniqueBusinessName === "you are not the owner of this business" ||
      uniqueBusinessName === "Error"
    ) {
      return { data: "you are not the owner of this business" };
    }

    const [nextResult] = await pool.query(sqlToGetNextInventory, values);

    const updateSingleRecord = async (Result) => {
      const { purchaseQty, salesQty, creditsalesQty, brokenQty, dailySalesId } =
        Result;
      inventoryItem =
        Number(inventoryItem) +
        Number(purchaseQty) -
        Number(salesQty) -
        Number(creditsalesQty) -
        Number(brokenQty);
      const id = Result.dailySalesId;

      const updateQuery = `UPDATE dailyTransaction SET inventoryItem='${inventoryItem}', reportStatus='unreported to total sales' WHERE dailySalesId='${id}'`;
      await pool.query(updateQuery);

      // Formatted date for deletion
      const formattedDate = DateFormatter(registeredTimeDaily);

      const deleteFromTotalSales = `DELETE FROM ${uniqueBusinessName}_Transaction WHERE productIDTransaction='${ProductId}' AND registeredTime='${formattedDate}'`;
      await pool.query(deleteFromTotalSales);
    };

    for (const result of nextResult) {
      await updateSingleRecord(result);
    }

    return { data: "success" };
  } catch (error) {
    console.error("Error:", error);
    return { data: error.message };
  }
};
let getPreviousDayInventory = async (
  dailySalesId,
  mainProductId,
  businessId,
  registeredTimeDaily
) => {
  let sqlToGetPrevInventori = `select * from dailyTransaction where dailySalesId<'${dailySalesId}' and registeredTimeDaily<='${registeredTimeDaily}' and mainProductId='${mainProductId}' and businessId='${businessId}' order by registeredTimeDaily desc, dailySalesId desc limit 1`;
  let [prevResult] = await pool.query(sqlToGetPrevInventori);
  let inventoryItem = 0;
  if (prevResult.length > 0) inventoryItem = prevResult[0].inventoryItem;
  // console.log("inventoryItem", inventoryItem);

  return [inventoryItem, prevResult];
};

let registerSinglesalesTransaction = async (body) => {
  try {
    let {
      Description,
      brokenQty,
      businessId,
      purchaseQty,
      salesQty,
      ProductId,
      selectedDate,
      salesType,
      creditPaymentDate,
      items,
      token,
      unitPrice,
      useNewPrice,
      userID,
    } = body;
    // console.log("@registerSinglesalesTransaction", body);
    // return;
    let { productsUnitCost, mainProductId, productsUnitPrice } = items;
    if (unitPrice) items.productsUnitPrice = unitPrice;
    if (!useNewPrice) {
      unitPrice = productsUnitPrice;
    }

    if (mainProductId == null) mainProductId = ProductId;
    // let { userID } = JWT.verify(token, tokenKey);
    let salesTypeColumn = "salesQty";
    if (salesType == "On credit") {
      salesTypeColumn = "creditsalesQty";
    }
    let sqlToGetPreviousInventory = `select * from dailyTransaction where   registeredTimeDaily<=? and mainProductId=? and businessId=? order by registeredTimeDaily DESC,dailySalesId DESC limit 1`;
    let prevVal = [selectedDate, mainProductId, businessId];
    let [inventoryData] = await pool.query(sqlToGetPreviousInventory, prevVal);
    console.log(" inventoryData ===", inventoryData);
    let inventoryItem = 0;

    if (inventoryData.length > 0)
      inventoryItem = inventoryData[0].inventoryItem;
    inventoryItem =
      Number(inventoryItem) +
      Number(purchaseQty) -
      Number(salesQty) -
      Number(brokenQty);

    const query = `INSERT INTO dailyTransaction (mainProductId,purchaseQty, ${salesTypeColumn},salesTypeValues,creditPaymentDate,businessId, ProductId, brokenQty, Description, registeredTimeDaily, itemDetailInfo, reportStatus,registeredBy,inventoryItem,unitPrice,unitCost) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      mainProductId,
      purchaseQty,
      salesQty,
      salesType,
      creditPaymentDate,
      businessId,
      ProductId,
      brokenQty,
      Description,
      selectedDate,
      JSON.stringify(items),
      "unreported to total sales",
      userID,
      inventoryItem,
      unitPrice,
      productsUnitCost,
    ];
    let [result] = await pool.query(query, values);
    let nextResult = await updateNextInventory(
      result.insertId,
      mainProductId,
      businessId,
      inventoryItem,
      token,
      ProductId,
      selectedDate,
      userID
    );
    return nextResult;
  } catch (error) {
    return { error: error.message };
  }
};
let getDailyTransaction = async (body) => {
  try {
    let getTransaction = "";
    let {
      fromDate,
      toDate,
      productId,
      businessId,
      currentDates,
      businessName,
      userID,
    } = body;
    businessName = await getUniqueBusinessName(businessId, userID);
    console.log("businessName", businessName);
    if (businessName == "you are not owner of this business") {
      return { data: "Error", Error: businessName };
    }
    let query, values;
    if (productId === "getAllTransaction") {
      query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId    WHERE dt.businessId = ?  AND dt.registeredTimeDaily = ?  `;
      values = [
        "dailyTransaction",
        `${businessName}_products`,
        "usersTable",
        businessId,
        currentDates,
      ];
      if (isValidDateFormat(fromDate) && isValidDateFormat(toDate)) {
        query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId WHERE dt.businessId = ?  AND dt.registeredTimeDaily between '${fromDate}' and '${toDate}'`;
        values = [
          "dailyTransaction",
          `${businessName}_products`,
          "usersTable",
          businessId,
        ];
      }
    } else {
      query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut ON bp.ProductId = dt.ProductId and ut.userId = dt.registeredBy WHERE dt.businessId = ?  AND dt.ProductId = ?  AND dt.registeredTimeDaily = ? `;
      values = [
        "dailyTransaction",
        `${businessName}_products`,
        "usersTable",
        businessId,
        productId,
        currentDates,
      ];
    }

    let [rows] = await pool.query(query, values);

    return { data: rows, getTransaction };
  } catch (error) {
    console.log("error", error);
    return { data: "error" };
  }
};
let deleteTransactions = async (body) => {
  try {
    let {
      dailySalesId,
      mainProductId,
      businessId,
      ProductId,
      token,
      registeredTimeDaily,
      userID,
    } = body;
    if (mainProductId == null) mainProductId = ProductId;

    const [inventoryItem] = await getPreviousDayInventory(
      dailySalesId,
      mainProductId,
      businessId,
      registeredTimeDaily
    );

    const deleteSql = `DELETE FROM dailyTransaction WHERE dailySalesId = ?`;
    let [results] = await pool.query(deleteSql, [dailySalesId]);

    let updateResults = updateNextInventory({
      dailySalesId,
      mainProductId,
      businessId,
      inventoryItem,
      token,
      userID,
      ProductId,
      registeredTimeDaily,
    });

    return { data: "success" };
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: "error", error: "error no 23" };
  }
};
let updateDailyTransactions = async (body) => {
  try {
    const {
      unitCost,
      registeredTimeDaily,
      ProductId,
      businessId,
      dailySalesId,
      Description,
      brokenQty,
      creditPaymentDate,
      creditsalesQty,
      purchaseQty,
      registrationDate,
      salesQty,
      salesTypeValues,
      userID,

      itemDetailInfo,
    } = body;
    let { mainProductId } = body;

    const itemDetailInfoObject = JSON.parse(itemDetailInfo);
    if (unitCost) itemDetailInfoObject.unitCost = unitCost;

    console.log("2344", body.items);
    console.log(
      " itemDetailInfoObject.unitCost ",
      itemDetailInfoObject.unitCost
    );

    if (!mainProductId) mainProductId = ProductId;

    const [inventoryItem, prevResult] = await getPreviousDayInventory(
      dailySalesId,
      mainProductId,
      businessId,
      registeredTimeDaily
    );

    const updatedInventoryItem =
      inventoryItem + purchaseQty - salesQty - creditsalesQty - brokenQty;

    const updateQuery = `UPDATE dailyTransaction SET purchaseQty=?, unitCost=?, salesQty=?, creditsalesQty=?, salesTypeValues=?, creditPaymentDate=?, brokenQty=?, Description=?, inventoryItem=?, itemDetailInfo=? WHERE dailySalesId=?`;

    const updateValues = [
      purchaseQty,
      unitCost,
      salesQty,
      creditsalesQty,
      salesTypeValues,
      creditPaymentDate,
      brokenQty,
      Description,
      updatedInventoryItem,
      JSON.stringify(itemDetailInfoObject),
      dailySalesId,
    ];

    const [updateResult] = await pool.query(updateQuery, updateValues);
    if (updateResult.affectedRows > 0) {
      await updateNextInventory({
        dailySalesId,
        mainProductId,
        businessId,
        inventoryItem: updatedInventoryItem,
        userID,
        ProductId,
        registeredTimeDaily,
      });

      return { data: "update successfully" };
    } else {
      return { data: "data not found" };
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: error.message });
  }
};

const getSingleItemsTransaction = async (reqBody, query) => {
  const { businessId, toDate, fromDate, productName } = query;
  const { userID } = reqBody;

  let businessName = await getUniqueBusinessName(businessId, userID);

  if (businessName === "you are not owner of this business") {
    return { error: "Unauthorized access" };
  }

  const sqlQuery = `
    SELECT *
    FROM ${businessName}_Transaction AS t
    INNER JOIN ${businessName}_products AS p
    ON t.productIDTransaction = p.ProductId
    WHERE p.productName LIKE ?
    AND t.registeredTime BETWEEN ? AND ?
  `;

  const queryParams = [`%${productName}%`, fromDate, toDate];

  try {
    const [rows] = await pool.query(sqlQuery, queryParams);
    console.log("Fetched rows:", rows);
    ({ data: rows });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
let getMultipleItemsTransaction = async (body, query) => {
  try {
    let { toDate, fromDate, selectSearches, productName, token, businessId } =
      query;

    let selectData = `select * from dailyTransaction where registeredTimeDaily BETWEEN '${fromDate}' and '${toDate}' and businessId='${businessId}'`;
    // console.log("  query;", query);
    let [results] = await pool.query(selectData);
    return { data: results };
  } catch (error) {
    console.log("error", error);
    return { data: "error 113" };
  }
};
let getBusinessTransactions = async (body, query) => {
  let { BusinessID } = query.business;
  let selcetEachInfo = `select * from dailyTransaction where businessId='${BusinessID}'`;
  console.log("selcetEachInfo", selcetEachInfo);
  let [eachResult] = await pool.query(selcetEachInfo);
  return { data: eachResult };
};
const deleteSalesPurchase = async (body, query) => {
  try {
    const { items, userID } = body;
    const { transactionId, businessId } = items;

    const businessName = await getUniqueBusinessName(businessId, userID);
    const deleteQuery = "DELETE FROM ?? WHERE transactionId = ?";
    const table = `${businessName}_Transaction`;
    const deleteValues = [table, transactionId];

    const verifyQuery =
      "SELECT * FROM Business WHERE uniqueBusinessName=? AND ownerId = ?";
    const verifyValues = [businessName, userID];

    // Verify business ownership
    const [verificationRows] = await pool.query(verifyQuery, verifyValues);
    if (verificationRows.length > 0) {
      // Business is owned by the user, proceed with deletion
      const [deleteResults] = await pool.query(deleteQuery, deleteValues);
      return { data: "deleted", results: deleteResults };
    } else {
      return { data: "NotAllowedByYou" };
    }
  } catch (error) {
    console.error("Error in deleteSalesPurchase:", error);
    throw new Error("Internal Server Error");
  }
};

const registerTransaction = async (body) => {
  try {
    const { businessId, userID, ProductsList, dates } = body;
    const businessName = await getUniqueBusinessName(businessId, userID);

    // Validate business name
    const validate = validateAlphabet(businessName);
    if (validate !== "correctData") {
      return "Invalid business name. Please use only alphanumeric characters.";
    }

    const insertedProducts = [];
    const inventoryList = [];

    for (const product of ProductsList) {
      const {
        ProductId,
        mainProductId,
        productsUnitCost,
        productsUnitPrice,
        salesQuantity,
        salesTypeValues,
        creditDueDate,
        purchaseQty,
        creditSalesQty,
        wrickageQty,
        description,
        registrationSource,
      } = product;

      // Check if the product is already registered for the given date
      const selectToCheck = `SELECT * FROM ${businessName}_Transaction WHERE registeredTime LIKE ? AND productIDTransaction = ?`;
      const [rows] = await pool.query(selectToCheck, [`%${dates}%`, ProductId]);

      if (rows.length > 0) {
        continue; // Skip if product is already registered
      }

      // Calculate Inventory
      const prevInventoryQuery = `SELECT * FROM ${businessName}_Transaction WHERE mainProductId = ? AND registeredTime <= ? ORDER BY registeredTime DESC LIMIT 1`;
      const [prevInventoryRows] = await pool.query(prevInventoryQuery, [
        mainProductId,
        dates,
      ]);

      let Inventory = 0;
      if (prevInventoryRows.length > 0) {
        Inventory = prevInventoryRows[0].Inventory;
      }

      Inventory +=
        parseFloat(purchaseQty) -
        parseFloat(salesQuantity) -
        parseFloat(wrickageQty) -
        parseFloat(creditSalesQty);
      inventoryList.push(Inventory);

      // Insert transaction
      const insertQuery = `INSERT INTO ${businessName}_Transaction(description, unitCost, unitPrice, productIDTransaction, mainProductId, salesQty, purchaseQty, registeredTime, wrickages, Inventory, creditDueDate, salesTypeValues, creditSalesQty, registrationSource, registeredBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const Values = [
        description,
        productsUnitCost,
        productsUnitPrice,
        ProductId,
        mainProductId || ProductId, // If mainProductId is null or undefined, use ProductId
        salesQuantity,
        purchaseQty,
        dates,
        wrickageQty,
        Inventory,
        creditDueDate,
        salesTypeValues,
        creditSalesQty || 0, // Default creditSalesQty to 0 if null or undefined
        registrationSource,
        userID,
      ];

      await pool.query(insertQuery, Values);

      // Update dailyTransaction if registrationSource is "Single"
      if (registrationSource === "Single") {
        const updateQuery = `UPDATE dailyTransaction SET reportStatus='reported to total sales' WHERE registeredTimeDaily=? AND businessId=? AND ProductId=?`;
        await pool.query(updateQuery, [dates, businessId, ProductId]);
      }

      // Prepare inserted product data for response
      const insertedProduct = {
        mainProductId,
        creditSalesQty: creditSalesQty || 0,
        creditDueDate,
        salesTypeValues,
        description,
        productsUnitCost,
        productsUnitPrice,
        ProductId,
        salesQuantity,
        purchaseQty,
        wrickageQty,
        Inventory,
      };
      insertedProducts.push(insertedProduct);
    }

    if (insertedProducts.length === 0) {
      return {
        data: "All data are registered before",
        previouslyRegisteredData: [],
        date: dates,
        values: "",
      };
    }

    // Update next date inventory
    updateNextDateInventory(
      `${businessName}_Transaction`,
      insertedProducts,
      dates,
      inventoryList
    );

    return {
      data: "Data is registered successfully",
      previouslyRegisteredData: [],
      dataToSendResponseToClient: "NoNeed",
    };
  } catch (error) {
    console.error("Error in registerTransaction:", error);
    throw new Error("Internal Server Error");
  }
};

let ViewTransactions = async (body) => {
  try {
    let businessName = "",
      time = body.time;

    // Validate business name
    let validate = validateAlphabet(body.businessName);
    if (validate !== "correctData") {
      return "This data contains a string so no need for execution";
    }
    businessName = body.businessName;

    const transactionTable = `${businessName}_Transaction`;
    const productsTable = `${businessName}_products`;
    const select = `SELECT * FROM ?? as t INNER JOIN ?? as p ON p.productId = t.productIDTransaction WHERE t.registeredTime LIKE ?`;
    const timeDate = `%${time}%`;
    const values = [transactionTable, productsTable, timeDate];

    let salesTransaction = await pool.query(select, values);
    salesTransaction = salesTransaction[0]; // Extract result from array

    const selectCostQuery = `SELECT * FROM ${businessName}_expenses, ${businessName}_Costs WHERE ${businessName}_expenses.costId = ${businessName}_Costs.costsId AND costRegisteredDate = ?`;
    const expenseTransaction = await pool.query(selectCostQuery, [time]);

    return { expenseTransaction: expenseTransaction[0], salesTransaction };
  } catch (error) {
    console.error("Error in ViewTransactions:", error);
    throw new Error("Internal Server Error");
  }
};

let updateTransactions = async (req, res) => {
  try {
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
      businessName,
    } = req.body;

    // Validate business name
    let validate = validateAlphabet(businessName, res);
    if (validate !== "correctData") {
      return res.send("This data contains a string so no need for execution");
    }

    // Check partial payment
    let sqlToCheckPartialPayment = `SELECT salesTypeValues FROM ${businessName}_Transaction WHERE transactionId=?`;
    let [partialValues] = await pool.query(sqlToCheckPartialPayment, [
      transactionId,
    ]);
    let savedSalesTypeValues = partialValues[0]?.salesTypeValues || "";

    if (savedSalesTypeValues === "Partially paied") {
      salesTypeValues = savedSalesTypeValues;
    }

    // Retrieve previous inventory data
    const selectQuery = `SELECT * FROM ${businessName}_Transaction WHERE registeredTime < ? AND mainProductId = ? ORDER BY registeredTime DESC LIMIT 1`;
    let [data] = await pool.query(selectQuery, [date, mainProductId]);

    let currentInventory =
      Number(purchaseQty) -
      Number(salesQty) -
      Number(salesQtyInCredit) -
      Number(wrickages);

    if (data.length > 0) {
      let prevInventory = parseInt(data[0].Inventory);
      currentInventory += prevInventory;
    }

    // Update transaction
    const updateQuery = `UPDATE ${businessName}_Transaction SET wrickages=?, purchaseQty=?, salesQty=?, creditsalesQty=?, Inventory=?, description=?, salesTypeValues=?, creditPayementdate=? WHERE transactionId=?`;
    await pool.query(updateQuery, [
      wrickages,
      purchaseQty,
      salesQty,
      salesQtyInCredit,
      currentInventory,
      Description,
      salesTypeValues,
      creditPayementdate,
      transactionId,
    ]);

    // Select data for response
    const sqlToSelect = `SELECT * FROM ${businessName}_Transaction AS t, ${businessName}_products AS p WHERE t.productIDTransaction = p.ProductId AND t.registeredTime BETWEEN ? AND ? ORDER BY t.registeredTime DESC`;
    let [rows] = await pool.query(sqlToSelect, [
      req.body.fromDate,
      req.body.toDate,
    ]);

    rows.forEach(async (item) => {
      if (req.body.transactionId == item.transactionId) {
        await updateNextDateInventory(
          `${businessName}_Transaction`,
          [item],
          DateFormatter(item.registrationDate),
          [currentInventory],
          {
            sqlToSelect,
            inputToSelect: [req.body.fromDate, req.body.toDate],
            res,
          }
        );
        return { data: rows };
      }
    });
  } catch (error) {
    console.error("Error in updateTransactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updateTransactions,
  ViewTransactions,
  registerTransaction,
  deleteSalesPurchase,
  getBusinessTransactions,
  getMultipleItemsTransaction,
  getSingleItemsTransaction,
  updateDailyTransactions,
  registerSinglesalesTransaction,
  getDailyTransaction,
  deleteTransactions,
};
