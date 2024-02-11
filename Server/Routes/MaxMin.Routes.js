const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { authMiddleware } = require("../middleware/Auth");
let path = "/";

const Router = require("express").Router();
Router.post(path + "getMaximumSales/", authMiddleware, async (req, res) => {
  let { userID, businessName, DateRange, businessId } = req.body;
  let { toDate, fromDate } = DateRange;
  let uniqueBusinessName = await getUniqueBusinessName(businessId, userID);
  if (uniqueBusinessName == `you are not owner of this business`) {
    return res.json({ data: uniqueBusinessName });
  }
  businessName = uniqueBusinessName;
  // let select = `select * from ${businessName}_products, ${businessName}_Transaction where  ProductId = productIDTransaction and  registrationDate  between '${toDate}' and '${fromDate}'`;
  const table1 = `${businessName}_products`;
  const table2 = `dailyTransaction`;

  const select = `SELECT *
                FROM ?? as P, ?? AS T
                WHERE P.ProductId = T.ProductId
                AND  T.registeredTimeDaily  BETWEEN ? AND ?`;

  const values = [table1, table2, fromDate, toDate];

  pool
    .query(select, values)
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
Router.post(path + "GetMinimumQty/", authMiddleware, async (req, res) => {
  const { businessId, userID } = req.body;
  let uniqueBusinessName = await getUniqueBusinessName(businessId, userID);

  if (uniqueBusinessName === "you are not owner of this business") {
    return res.json({ data: uniqueBusinessName });
  }

  console.log("uniqueBusinessName", uniqueBusinessName);
  const table = `${uniqueBusinessName}_`;

  const selectInventory = `SELECT P.*, T.* FROM ${table}products AS P LEFT JOIN  dailyTransaction  AS T
    ON T.ProductId = P.ProductId
    WHERE T.registeredTimeDaily = (
      SELECT MAX(registeredTimeDaily)
      FROM dailyTransaction
      WHERE T.ProductId = P.ProductId
    ) ORDER BY P.ProductId`;

  try {
    const [result] = await pool.query(selectInventory);
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
    return res.json({ data: "@minimumerr", error });
  }
});

module.exports = Router;
