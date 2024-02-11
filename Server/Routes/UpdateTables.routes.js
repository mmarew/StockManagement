const express = require("express");
const { pool } = require("../Database");
const router = express.Router();
router.get("/updateCreditCollections", async (req, res) => {
  let update = `ALTER TABLE creditCollection MODIFY collectionAmount FLOAT`;
  try {
    await pool.query(update);
    console.log("creditCollection Updated successfully");
    res.send("Successfully updated creditCollection table");
  } catch (error) {
    console.error("Error updating creditCollection table:", error);
    res.status(500).send("Error updating creditCollection table");
  }
});
router.get("/updateDailyTransactions", async (req, res) => {
  let update = `ALTER TABLE dailyTransaction MODIFY purchaseQty FLOAT, MODIFY unitPrice FLOAT, MODIFY salesQty FLOAT, MODIFY creditsalesQty FLOAT, MODIFY brokenQty FLOAT,MODIFY inventoryItem FLOAT  `;
  try {
    await pool.query(update);
    console.log("Daily transaction is Updated successfully ");
    res.send("Successfully updated update Daily Transactions table");
  } catch (error) {
    console.error("Error updating creditCollection table:", error);
    res.status(500).send("Error updating creditCollection table");
  }
});
router.get("/updateBusiness", async (req, res) => {
  try {
    let select = `select * from Business`;
    let [selectResults] = await pool.query(select);
    //   console.log("selectResults", selectResults);
    res.json({ data: selectResults });
    let tables = ["_expenses", "_Costs", "_products", "_Transaction"];
    selectResults.map(async (result) => {
      let { uniqueBusinessName } = result;
      //   console.log("uniqueBusinessName", uniqueBusinessName + tables[2]);
      let ProductsTable = uniqueBusinessName + tables[2];
      let updateProducts = `ALTER TABLE ${ProductsTable} 
    modify productsUnitCost float,
    modify prevUnitCost float,
    modify productsUnitPrice float,
    modify prevUnitPrice float,
    modify minimumQty float,
    modify prevMinimumQty float `;
      await pool.query(updateProducts);
      console.log(ProductsTable + " updated successfully");
      let tableExpenses = uniqueBusinessName + tables[0];
      let updateExpencesTable = `alter table ${tableExpenses}  modify costAmount float `;
      await pool.query(updateExpencesTable);
      console.log(tableExpenses + "  modified ");
      let cotstTable = uniqueBusinessName + tables[1];
      let alterCost = `alter table ${cotstTable}  modify unitCost float `;
      let x = await pool.query(alterCost);
      console.log(alterCost + "  updated successfully");
    });
  } catch (error) {
    console.log("error is ", error);
  }
});

module.exports = router;
