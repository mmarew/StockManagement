const express = require("express");
const { Auth } = require("../Auth");
const { authMiddleware } = require("../middleware/Auth");
const { getCreditList } = require("../Controllers/Credit.controller");
const router = express.Router();
require("dotenv").config();

router.get("/Credit/getUsersCreditList", authMiddleware, getCreditList);
router.post("/updatePartiallyPaidInfo", async (req, res) => {
  try {
    const { DeletableInfo } = req.body;

    // Sanitize and validate collection IDs to prevent injection attacks
    const sanitizedCollectionIds = DeletableInfo.map((info) => {
      const collectionId = String(info.collectionId).replace(/'/g, "\\'"); // Escape single quotes
      return collectionId;
    });

    // Construct the SQL query using parameterized values to prevent injection
    const sql = `DELETE FROM creditCollection WHERE collectionId IN (?)`;

    // Execute the query using the pool instance
    await pool.query(sql, [sanitizedCollectionIds]);

    // Send a successful response
    res.json({ data: "Updated successfully" });
  } catch (error) {
    // Handle errors appropriately, such as logging errors and sending appropriate responses
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.put("/confirmPayments", async (req, res) => {
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

  let [results] = await pool.query(select);
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
    await pool.query(update);
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
    let [updateResult] = await pool.query(update);
    console.log("updateResult", updateResult);
  }
  let { userID } = jwt.verify(token, tokenKey);
  // console.log("responces", responces);
  let Insert = `insert into creditCollection(collectionDate,collectionAmount,registrationSource,transactionId,userId,businessId,targtedProductId) 
  values('${creditPaymentDate}','${collectedAmount}','Single', '${dailySalesId}','${userID}','${businessId}','${ProductId}')`;
  console.log("Insert", Insert);
  // return;
  let [responce] = await pool.query(Insert);
  if (responce.affectedRows > 0) {
    res.json({ data: "You have inserted your data correctly" });
  }
});
module.exports = router;
