const express = require("express");
const { pool } = require("../Config/db.config");
const tokenKey = process.env.tokenKey;
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const JWT = require("jsonwebtoken");
const { CurrentYMD } = require("../DateFormatter");
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");
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
      console.log("rowData", rowData);
      // return;
      // expDescription: 'klkl', expAmount: '90909', expDate: '2024-02-16'
      let { businessId, userID, costData, expDescription, expAmount, expDate } =
        req.body;
      let businessName = await getUniqueBusinessName(businessId, userID);

      let i = 0;
      let costsId = costData.costsId,
        costName = costData.costName;
      costName = costName.replace(/ /g, "");
      const table = `${businessName}_expenses`;
      const insert = `INSERT INTO ?? (costId, costAmount, costDescription, costRegisteredDate) VALUES (?, ?, ?, ?)`;
      const values = [table, costsId, expAmount, expDescription, expDate];
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
    let { businessId, fromDate, toDate, searchTarget, InputValue } = req.query;
    let { userID } = req.body;
    console.log("userID", userID);
    let businessName = await getUniqueBusinessName(businessId, userID);
    let sql = `SELECT * FROM ?? as e, ?? as c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
    // define the input data as an array of values
    let inputExp = [
      `${businessName}_expenses`,
      `${businessName}_Costs`,
      fromDate,
      toDate,
    ];
    if (searchTarget == "singleTransaction") {
      console.log("InputValue", InputValue);
      let { costName, costsId } = InputValue;
      sql += ` and c.costsId = ?`;
      inputExp.push(costsId);
    }
    let [rows] = await pool.query(sql, inputExp);
    res.json({
      expenceTransaction: rows,
    });
  } catch (error) {
    res.json({ expenceTransaction: "error no 113" });
  }
});
router.get("/getexpencesLists", authMiddleware, getExpensesListsController);
router.post(
  "/deleteExpenceItem",
  authMiddleware,
  authMiddleware2,
  async (req, res) => {
    try {
      const { userID, costsId, businessId } = req.body;

      // Retrieve businessName based on businessId and userID
      const businessName = await getUniqueBusinessName(businessId, userID);

      if (!businessName) {
        return res.json({ data: "Please make logout and login again." });
      }

      // Check if the business and user combination is valid
      const [businessData] = await pool.query(
        "SELECT * FROM Business WHERE uniqueBusinessName = ? AND ownerId = ?",
        [businessName, userID]
      );

      if (!businessData.length) {
        return res.json({ data: "You are not allowed" });
      }

      // Delete the cost item
      const table = `${businessName}_Costs`;
      await pool.query("DELETE FROM ?? WHERE costsId = ?", [table, costsId]);

      res.json({ data: "deleted" });
    } catch (error) {
      console.error(error);
      res.json({ data: "Internal Server Error" });
    }
  }
);
router.post("/getExpencesLists/", authMiddleware, async (req, res) => {
  try {
    const { businessId, userID } = req.body;
    const businessName = await getUniqueBusinessName(businessId, userID);

    if (businessName === "you are not owner of this business") {
      return res.json({ data: businessName });
    }

    const selectQuery = `SELECT * FROM ??`;
    const [rows] = await pool.query(selectQuery, [`${businessName}_Costs`]);

    res.json({ data: rows });
  } catch (error) {
    res.json({ data: "err", err: "error 111" });
  }
});

router.post("/searchExpByName", authMiddleware, async (req, res) => {
  try {
    console.log("req", req.body);
    const { expName, businessId, userID } = req.body;
    const businessName = await getUniqueBusinessName(businessId, userID);

    if (businessName === "you are not owner of this business") {
      return res.json({ data: businessName });
    }
    // Construct the SQL query with a dynamic LIKE clause
    const selectQuery = `
      SELECT * 
      FROM ${businessName}_Costs 
      WHERE costName LIKE ?
    `;

    // Execute the query passing '%' + expName + '%' to search for any occurrence of expName
    const [rows] = await pool.query(selectQuery, [`%${expName}%`]);

    res.json({ data: rows });
  } catch (error) {
    console.error("Error searching expenses by name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
