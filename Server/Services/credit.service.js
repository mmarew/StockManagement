const tokenKey = process.env.tokenKey;
const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const jwt = require("jsonwebtoken");
let getCreditList = async (req) => {
  try {
    let userId = req.body.userID;

    let { businessName, businessId, fromDate, toDate } = req.query;

    businessName = await getUniqueBusinessName(businessId, userId);
    if (businessName == "you are not owner of this business") {
      return { data: businessName };
    }
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
    const [Information] = await pool.query(SelectOnCreditFromDaily);
    soldInDaily_SoldOncredits = Information;
    for (const Info of Information) {
      const transactionId = Info.dailySalesId;
      transactionIdList.push(transactionId);
    }
    const [data] = await pool.query(SelectOnCreditFromTotal);
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
      // Execute the query using the pool instance and sanitized transaction IDs
      let [FromSingleSales] = await pool.query(
        sqlToCollectedMoneyFromSingleSales,
        [businessId, transactionIdList]
      );
      let [FromTotalSales] = await pool.query(
        sqlToCollectedMoneyFromTotalSales,
        [businessId, transactionIdList]
      );
      console.log("Money from Total sales", FromTotalSales);
      partiallyPaidInTotal = [...FromTotalSales, ...FromSingleSales];
    } else {
      // [partiallyPaidInTotal] = await pool.query(sqlToCollectedMoney);
      let FromTotalSales = [],
        FromSingleSales = [];
      if (sqlToCollectedMoneyFromTotalSales != "")
        [FromTotalSales] = await pool.query(sqlToCollectedMoneyFromTotalSales);
      if (sqlToCollectedMoneyFromSingleSales != "")
        [FromSingleSales] = await pool.query(
          sqlToCollectedMoneyFromSingleSales
        );
      partiallyPaidInTotal = [...FromTotalSales, ...FromSingleSales];
    }
    //console.log(data);
    return {
      partiallyPaidInTotal,
      soldOnTotal_Oncredit: data,
      soldInDaily_SoldOncredits,
    };
  } catch (error) {
    console.log("error", error);
    return { data: "error no 891" };
  }
};
module.exports.getCreditList = getCreditList;
