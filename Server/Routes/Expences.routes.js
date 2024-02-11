const express = require("express");
const { pool } = require("../Config/db.config");
const tokenKey = process.env.tokenKey;
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const JWT = require("jsonwebtoken");
const { CurrentYMD } = require("../DateFormatter");
const { authMiddleware } = require("../middleware/Auth");
const {
  getExpensesListsController,
} = require("../Controllers/Expences.controller");
const router = express.Router();
router.post("/", () => {});
router.get("/", () => {});
function insertIntoCosts(businessName, data, res, userID, registrationDate) {
  const sanitizedCostName = data.Costname;
  const checkQuery = `SELECT * FROM ?? WHERE costName=?`;
  let values = [businessName, sanitizedCostName];
  pool
    .query(checkQuery, values)
    .then(([rows]) => {
      let result = rows;
      console.log("result", result);
      // return;
      if (result.length > 0) {
        return res.json({ data: "already registered before" });
      } else {
        let insert = `insert into ?? (costName,registeredBy,expItemRegistrationDate) values( ?,?,?)`;
        values = [businessName, sanitizedCostName, userID, registrationDate];
        pool
          .query(insert, values)
          .then(([rows]) => {
            console.log(`rows on ${businessName}`, rows);
            if (rows.affectedRows > 0)
              res.json({ data: "Registered successfully" });
            else {
              res.json({ data: "unable to  register data" });
            }
          })
          .catch((error) => {
            res.json({ err: error });
            console.log("error", error);
          });
      }
    })
    .catch((error) => {
      console.log("error 1120", error);
      return res.json({ error });
    });
}

router.post("/Expences/AddExpencesItems/", authMiddleware, async (req, res) => {
  // console.log(req.body);
  let { businessId, registrationDate, userID } = req.body;
  let businessName = await getUniqueBusinessName(businessId, userID);
  console.log("businessName", businessName);
  if (businessName == "you are not owner of this business")
    return res.json({ data: "you are not owner of this business" });
  insertIntoCosts(
    `${businessName}_Costs`,
    req.body,
    res,
    userID,
    registrationDate
  );
});
router.post(
  "/Expences/updateMyexpencesList",
  authMiddleware,
  async (req, res) => {
    let { businessId, userID, costDescription, costAmount, expenseId } =
      req.body;

    let businessName = await getUniqueBusinessName(businessId, userID);
    console.log("req.body", req.body);
    console.log(" businessName", businessName);

    // return;
    const query =
      "UPDATE ?? SET costDescription = ?, costAmount = ? WHERE expenseId = ?";
    const table = `${businessName}_expenses`;
    const values = [table, costDescription, costAmount, expenseId];

    pool
      .query(query, values)
      .then(([rows]) => {
        //console.log(`Updated ${rows.affectedRows} row(s)`);
        res.json({ data: "updated" });
      })
      .catch((error) => {
        console.error(error);
        res.json({ data: "err no a11" });
      });
  }
);
router.post(
  "/Expences/deleteExpencesItem",
  authMiddleware,
  async (req, res) => {
    console.log("req.body", req.body);
    let { businessId, userID, expenseId } = req.body;
    let businessName = await getUniqueBusinessName(businessId, userID);
    // return;
    let sql = `DELETE FROM ?? WHERE expenseId = ?`;
    let params = [`${businessName}_expenses`, expenseId];

    pool
      .query(sql, params)
      .then((result) => {
        res.status(200).json({ data: "deleteSuccess" });
      })
      .catch((err) => {
        //console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
);
router.post(
  `/Expences/registerExpenceTransaction/`,
  authMiddleware,
  async (req, res) => {
    try {
      let rowData = req.body;
      let { businessId, userID, costData, costDate, expDate } = req.body;
      let businessName = await getUniqueBusinessName(businessId, userID);

      let i = 0;
      let costsId = costData[i].costsId,
        costName = costData[i].costName;
      costName = costName.replace(/ /g, "");
      let Description = "Description_" + costName;
      let costAmount = rowData[costName],
        costDescription = rowData[Description];
      const table = `${businessName}_expenses`;
      const insert = `INSERT INTO ?? (costId, costAmount, costDescription, costRegisteredDate) VALUES (?, ?, ?, ?)`;
      const values = [table, costsId, costAmount, costDescription, expDate];
      pool
        .query(insert, values)
        // //console
        // .log("inserted values are ", values)
        .then((results) => {
          res.json({ data: "Inserted properly" });
        })
        .catch((error) => {
          console.log("error", error);
          res.json({ data: "error", error: "unable to insert" });
        });
    } catch (error) {
      console.log("error", error);
    }
  }
);
router.get("/Expences/getExpTransactions", authMiddleware, async (req, res) => {
  try {
    console.log("in getExpTransactions", req.query);
    let { businessId, fromDate, toDate } = req.query;
    let { userID } = req.body;
    console.log("userID", userID);

    let businessName = await getUniqueBusinessName(businessId, userID);
    const sql = `SELECT * FROM ?? as e, ?? as c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
    // define the input data as an array of values
    const inputExp = [
      `${businessName}_expenses`,
      `${businessName}_Costs`,
      fromDate,
      toDate,
    ];
    // console.log("sql", sql, " inputExp ", inputExp);
    // return;

    // execute the query with the input data
    let [rows] = await pool.query(sql, inputExp);
    res.json({
      expenceTransaction: rows,
    });
  } catch (error) {
    console.log("error on get expence transaction", error);
    res.json({ expenceTransaction: "error no 113" });
  }
});
router.get("/getexpencesLists", authMiddleware, getExpensesListsController);
router.post("/deleteExpenceItem", async (req, res) => {
  // console.log("req.body", req.body);
  // return;
  let { token, costsId, businessName, businessId, userPassword } = req.body;

  businessName = await getUniqueBusinessName(businessId, token);
  const userId = await Auth(token);
  let Password = "";
  let selectUserInfo = `select * from usersTable where userId='${userId}'`;
  console.log("businessName", businessName);
  let isMatch = false;
  let [Responces] = await pool.query(selectUserInfo);
  console.log("Responces", Responces);
  if (Responces.length <= 0) {
    return res.json({ data: "Please make logout and login again." });
  } else {
    Password = Responces[0].password;
    isMatch = bcrypt.compareSync(userPassword, Password);
    console.log("isMatch", isMatch);
  }

  if (!isMatch) return res.json({ data: "Wrong Password" });
  const select =
    "SELECT * FROM Business WHERE uniqueBusinessName = ? AND ownerId = ?";
  const selectValues = [businessName, userId];

  pool
    .query(select, selectValues)
    .then((responce) => {
      if (responce.length > 0) {
        const deleteCostItem = "DELETE FROM ?? WHERE costsId = ?";
        const table = `${businessName}_Costs`;
        const deleteCostItemValues = [table, costsId];
        return pool
          .query(deleteCostItem, deleteCostItemValues)
          .then((results) => {
            return res.json({ data: "deleted" });
          });
      } else {
        return res.json({ data: "youAreNotAllowed" });
      }
    })
    .catch((error) => {
      //console.error(error);
      res.json({ data: "err 501.1" });
    });
});

module.exports = router;
