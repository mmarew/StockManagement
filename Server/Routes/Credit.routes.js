// const express = require("express");
// const { Auth } = require("../Auth");
// const { authMiddleware } = require("../middleware/Auth");
// const { getCreditList } = require("../Controllers/Credit.controller");
// const { getUniqueBusinessName } = require("../UniqueBusinessName");
// const { pool } = require("../Config/db.config");
// const router = express.Router();
// require("dotenv").config();

// router.get("/Credit/getUsersCreditList", authMiddleware, getCreditList);
// router.post("/updatePartiallyPaidInfo", authMiddleware, async (req, res) => {
//   try {
//     const { DeletableInfo } = req.body;

//     // Sanitize and validate collection IDs to prevent injection attacks
//     const sanitizedCollectionIds = DeletableInfo.map((info) => {
//       const collectionId = String(info.collectionId).replace(/'/g, "\\'"); // Escape single quotes
//       return collectionId;
//     });

//     // Construct the SQL query using parameterized values to prevent injection
//     const sql = `DELETE FROM creditCollection WHERE collectionId IN (?)`;

//     // Execute the query using the pool instance
//     await pool.query(sql, [sanitizedCollectionIds]);

//     // Send a successful response
//     res.json({ data: "Updated successfully" });
//   } catch (error) {
//     // Handle errors appropriately, such as logging errors and sending appropriate responses
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });
// router.put("/confirmPayments", authMiddleware, async (req, res) => {
//   console.log(`req.body`, req.body);
//   // return;
//   let {
//     businessId,
//     creditPaymentDate,
//     collectedAmount,
//     salesWAy,
//     businessName,
//     userID,
//   } = req.body;
//   let {
//     dailySalesId,
//     transactionId,
//     registrationSource,
//     ProductId,
//     creditsalesQty,
//     unitPrice,
//     productsUnitPrice,
//   } = req.body.data;
//   businessName = await getUniqueBusinessName(businessId, userID);

//   let previouslycollectedAmount = 0;
//   console.log("transactionId", transactionId);
//   // let select = `select * from creditCollection where transactionId='${transactionId}' and businessId='${businessId}' and registrationSource='Total'`;

//   let SalesIncredit = creditsalesQty * productsUnitPrice,
//     select = `select * from creditCollection where transactionId='${dailySalesId}' and businessId='${businessId}' and registrationSource='Single'`;

//   let [results] = await pool.query(select);
//   // console.log("creditCollection results", results);
//   // return;
//   results.map((result) => {
//     previouslycollectedAmount += Number(result.collectionAmount);
//   });
//   let tobeCollected = Number(SalesIncredit) - Number(previouslycollectedAmount);
//   console.log(
//     "previouslycollectedAmount",
//     previouslycollectedAmount,
//     "SalesIncredit",
//     SalesIncredit,
//     "tobeCollected ",
//     tobeCollected
//   );

//   if (SalesIncredit == previouslycollectedAmount) {
//     let update = `update dailyTransaction set salesTypeValues='Credit paied' where transactionId='${dailySalesId}'`;
//     await pool.query(update);
//     return res.json({
//       data: `You have collected your money previously. Now you can't collect money again `,
//     });
//   }

//   if (Number(collectedAmount) > tobeCollected) {
//     return res.json({
//       data: `you can't collect money more than remain amount`,
//     });
//   }

//   if (SalesIncredit == previouslycollectedAmount + Number(collectedAmount)) {
//     let update = `update dailyTransaction set salesTypeValues='Credit paied' where dailySalesId='${dailySalesId}'`;
//     let [updateResult] = await pool.query(update);
//     console.log("updateResult", updateResult);
//   }

//   // console.log("responces", responces);
//   let Insert = `insert into creditCollection(collectionDate,collectionAmount,registrationSource,transactionId,userId,businessId,targtedProductId)
//   values('${creditPaymentDate}','${collectedAmount}','Single', '${dailySalesId}','${userID}','${businessId}','${ProductId}')`;
//   console.log("Insert", Insert);
//   // return;
//   let [responce] = await pool.query(Insert);
//   if (responce.affectedRows > 0) {
//     res.json({ data: "You have inserted your data correctly" });
//   }
// });
// module.exports = router;
const express = require("express");
const { authMiddleware } = require("../middleware/Auth");
const { getCreditList } = require("../Controllers/Credit.controller");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { pool } = require("../Config/db.config"); // Assuming you have a database connection pool
const router = express.Router();
require("dotenv").config();

router.get("/Credit/getUsersCreditList", authMiddleware, getCreditList);

router.post("/updatePartiallyPaidInfo", authMiddleware, async (req, res) => {
  try {
    const { DeletableInfo } = req.body;
    const sanitizedCollectionIds = DeletableInfo.map((info) =>
      String(info.collectionId).replace(/'/g, "\\'")
    );
    const sql = `DELETE FROM creditCollection WHERE collectionId IN (?)`;
    await pool.query(sql, [sanitizedCollectionIds]);
    res.json({ data: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/confirmPayments", authMiddleware, async (req, res) => {
  try {
    const {
      businessId,
      userID,
      creditPaymentDate,
      collectedAmount,
      salesWAy,
      data: {
        dailySalesId,
        transactionId,
        registrationSource,
        ProductId,
        creditsalesQty,
        unitPrice,
        productsUnitPrice,
      },
    } = req.body;

    const businessName = await getUniqueBusinessName(businessId, userID);
    let previouslycollectedAmount = 0;

    const selectQuery = `SELECT * FROM creditCollection WHERE transactionId='${dailySalesId}' AND businessId='${businessId}' AND registrationSource='Single'`;
    const [results] = await pool.query(selectQuery);

    results.forEach((result) => {
      previouslycollectedAmount += Number(result.collectionAmount);
    });

    const SalesIncredit = creditsalesQty * productsUnitPrice;
    const tobeCollected = SalesIncredit - previouslycollectedAmount;

    if (SalesIncredit === previouslycollectedAmount) {
      await pool.query(
        `UPDATE dailyTransaction SET salesTypeValues='Credit paied' WHERE transactionId='${dailySalesId}'`
      );
      return res.json({
        data: `You have collected your money previously. Now you can't collect money again`,
      });
    }

    if (collectedAmount > tobeCollected) {
      return res.json({
        data: `You can't collect more money than remaining amount`,
      });
    }

    if (SalesIncredit === previouslycollectedAmount + collectedAmount) {
      await pool.query(
        `UPDATE dailyTransaction SET salesTypeValues='Credit paied' WHERE dailySalesId='${dailySalesId}'`
      );
    }

    const InsertQuery = `INSERT INTO creditCollection (collectionDate, collectionAmount, registrationSource, transactionId, userId, businessId, targtedProductId) 
    VALUES ('${creditPaymentDate}', '${collectedAmount}', 'Single', '${dailySalesId}', '${userID}', '${businessId}', '${ProductId}')`;

    const [response] = await pool.query(InsertQuery);

    if (response.affectedRows > 0) {
      return res.json({ data: "You have inserted your data correctly" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
