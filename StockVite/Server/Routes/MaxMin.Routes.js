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
        return res.json({ data: rows, values });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ data: error });
    });
});
Router.post(path + "GetMinimumQty/", authMiddleware, async (req, res) => {
  try {
    const { businessId, userID } = req.body;
    let uniqueBusinessName = await getUniqueBusinessName(businessId, userID);

    if (uniqueBusinessName === "you are not owner of this business") {
      return res.json({ data: uniqueBusinessName });
    }
    const table = `${uniqueBusinessName}_`;
    const inventoryList = [];
    let getProducts = `SELECT * FROM ${table}products`;
    const [ProductResults] = await pool.query(getProducts);
    if (ProductResults.length === 0) {
      return res.json({ data: inventoryList });
      // return res.json({ data: "No products found" });
    } else if (ProductResults.length > 0) {
      ProductResults.map(async (item, index) => {
        let ProductId = item.ProductId;
        let queryToselectInventory = `SELECT * FROM ${table}products AS P, dailyTransaction AS T WHERE P.ProductId = T.ProductId AND P.ProductId = ${ProductId} ORDER BY T.dailySalesId desc limit 1`;
        let [eachInventory] = await pool.query(queryToselectInventory);
        console.log("eachInventory", eachInventory);
        inventoryList.push({ ...eachInventory[0] });
        if (index === ProductResults.length - 1) {
          return res.json({ data: inventoryList });
        }
      });
      console.log("ProductResults", ProductResults);
    }
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = Router;
