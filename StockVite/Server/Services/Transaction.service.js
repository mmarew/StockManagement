const { pool } = require("../Config/db.config");
const { isValidDateFormat, DateFormatter } = require("../DateFormatter");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const updateNextInventory = async ({
  dailySalesId,
  mainProductId,
  businessId,
  inventoryItem,
  userID,
  registeredTimeDaily,
}) => {
  try {
    const uniqueBusinessName = await getUniqueBusinessName(businessId, userID);
    if (
      uniqueBusinessName === "you are not the owner of this business" ||
      uniqueBusinessName === "Error"
    ) {
      return { data: "you are not the owner of this business" };
    }
    const sqlToGetNextInventory = `SELECT * FROM dailyTransaction WHERE mainProductId=? AND businessId=?  AND registeredTimeDaily>=?  ORDER BY registeredTimeDaily, dailySalesId ASC`;
    const values = [mainProductId, businessId, registeredTimeDaily];

    let [nextResult] = await pool.query(sqlToGetNextInventory, values);
    console.log("nextResult", nextResult);
    // return;
    let filteredArray = [];
    nextResult.map((result) => {
      // console.log("result", result);
      // console.log("registeredTimeDaily", registeredTimeDaily);
      // console.log(
      //   "result.registeredTimeDaily",
      //   DateFormatter(result.registeredTimeDaily)
      // );
      console.log(
        " ,result.dailySalesId=== ",
        result.dailySalesId,
        " ,dailySalesId=== ",
        dailySalesId
      );
      // return;
      if (registeredTimeDaily === DateFormatter(result.registeredTimeDaily)) {
        if (result.dailySalesId > dailySalesId) {
          filteredArray.push(result);
        }
      } else {
        filteredArray.push(result);
      }
    });
    nextResult = filteredArray;

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
  let sqlToGetPrevInventori = `select * from dailyTransaction where dailySalesId<'${dailySalesId}' and registeredTimeDaily<='${DateFormatter(
    registeredTimeDaily
  )}' and mainProductId='${mainProductId}' and businessId='${businessId}' order by registeredTimeDaily desc, dailySalesId desc limit 1`;

  console.log("queri is ", sqlToGetPrevInventori);
  let [prevResult] = await pool.query(sqlToGetPrevInventori);
  let inventoryItem = 0;
  if (prevResult.length > 0) inventoryItem = prevResult[0]?.inventoryItem;

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
      newUnitCost,
      useNewCost,
    } = body;
    // useNewCost, newUnitCost
    let { productsUnitCost, mainProductId, productsUnitPrice } = items;
    if (useNewCost) {
      productsUnitCost = Number(newUnitCost);
    }
    if (unitPrice) items.productsUnitPrice = unitPrice;
    if (!useNewPrice) {
      unitPrice = Number(productsUnitPrice);
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
    // console.log(" inventoryData ===", inventoryData);
    // return;
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
    //   dailySalesId,
    // mainProductId,
    // businessId,
    // inventoryItem,
    // userID,
    // ProductId,
    // registeredTimeDaily,
    let nextResult = await updateNextInventory({
      dailySalesId: result.insertId,
      mainProductId,
      businessId,
      inventoryItem,
      token,
      ProductId,
      registeredTimeDaily: selectedDate,
      userID,
    });
    return nextResult;
  } catch (error) {
    return { error: error.message };
  }
};
let getDailyTransaction = async (body) => {
  // console.log("first body", body);
  // return;
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
      productName,
    } = body;
    businessName = await getUniqueBusinessName(businessId, userID);
    console.log("businessName", businessName);
    if (businessName == "you are not owner of this business") {
      return { data: "Error", Error: businessName };
    }
    let query = null,
      values = "";

    if (productId === "getAllTransaction") {
      // get all transaction without filter
      query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId    WHERE dt.businessId = ?  AND dt.registeredTimeDaily = ?  `;
      values = [
        "dailyTransaction",
        `${businessName}_products`,
        "usersTable",
        businessId,
        DateFormatter(currentDates),
      ];
      if (isValidDateFormat(fromDate) && isValidDateFormat(toDate)) {
        query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId WHERE dt.businessId = ?  AND dt.registeredTimeDaily between '${DateFormatter(
          fromDate
        )}' and '${DateFormatter(toDate)}'`;
        values = [
          "dailyTransaction",
          `${businessName}_products`,
          "usersTable",
          businessId,
        ];
      }
    } else if (productId === "getSingleTransaction") {
      // get transaction by productName
      query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId    WHERE dt.businessId = ?  AND dt.registeredTimeDaily = ? and bp.productName like ? `;
      values = [
        "dailyTransaction",
        `${businessName}_products`,
        "usersTable",
        businessId,
        currentDates,
        `${productName}%`,
      ];
      if (isValidDateFormat(fromDate) && isValidDateFormat(toDate)) {
        query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut  ON ut.userId=dt.registeredBy and  bp.ProductId = dt.ProductId WHERE dt.businessId = ?  AND dt.registeredTimeDaily between '${fromDate}' and '${toDate}' and bp.productName like ?`;
        values = [
          "dailyTransaction",
          `${businessName}_products`,
          "usersTable",
          businessId,
          `%${productName}%`,
        ];
      }
      // getSingleTransaction
      // productName;
    } else {
      // get transaction by productId
      query = `SELECT * FROM ?? AS dt JOIN ?? AS bp JOIN ?? as ut ON bp.ProductId = dt.ProductId and ut.userId = dt.registeredBy WHERE dt.businessId = ?  AND dt.ProductId =? AND   dt.registeredTimeDaily between ? and ?`;

      values = [
        "dailyTransaction",
        `${businessName}_products`,
        "usersTable",
        businessId,
        productId,
        DateFormatter(fromDate),
        DateFormatter(toDate),
      ];
    }

    let [rows] = await pool.query(query, values);
    // console.log("query", query, " values", values);
    // console.log("first rows", rows);
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
    let {
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
      salesQty,
      salesTypeValues,
      userID,

      itemDetailInfo,
    } = body;
    // change values to number starts here
    unitCost = Number(unitCost);
    brokenQty = Number(brokenQty);
    creditsalesQty = Number(creditsalesQty);
    purchaseQty = Number(purchaseQty);
    salesQty = Number(salesQty);
    // change values to number ends here
    let { mainProductId } = body;

    const itemDetailInfoObject = JSON.parse(itemDetailInfo);
    if (unitCost) itemDetailInfoObject.unitCost = unitCost;

    if (!mainProductId) mainProductId = ProductId;

    const [inventoryItem, prevResult] = await getPreviousDayInventory(
      dailySalesId,
      mainProductId,
      businessId,
      registeredTimeDaily
    );

    console.log("inventoryItem", inventoryItem);

    const updatedInventoryItem =
      inventoryItem + purchaseQty - salesQty - creditsalesQty - brokenQty;
    //  + purchaseQty - salesQty - creditsalesQty - brokenQty;

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
let getMultipleItemsTransaction = async (body, query) => {
  try {
    let { toDate, fromDate, selectSearches, productName, token, businessId } =
      query;

    let selectData = `select * from dailyTransaction where registeredTimeDaily BETWEEN '${DateFormatter(
      fromDate
    )}' and '${DateFormatter(toDate)}' and businessId='${businessId}'`;
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
module.exports = {
  getBusinessTransactions,
  getMultipleItemsTransaction,
  updateDailyTransactions,
  registerSinglesalesTransaction,
  getDailyTransaction,
  deleteTransactions,
};
