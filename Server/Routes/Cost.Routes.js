const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { authMiddleware } = require("../middleware/Auth");

const Router = require("express").Router();
const path = "/";

Router.post(path + "/updateCostData/", authMiddleware, async (req, res) => {
  // let businessName = req.body.businessName,
  //   costName = req.body.costName,
  //   costsId = req.body.costsId;
  //  costName, businessId, businessName, token;
  let { businessName, costName, costsId, businessId, userID } = req.body;

  businessName = await getUniqueBusinessName(businessId, userID);
  console.log("@updateCostData businessName", businessName);
  const updateQuery = `UPDATE ?? SET costName=? WHERE costsId=?`;
  let values = [businessName + "_Costs", costName, costsId];
  // return;
  pool
    .query(updateQuery, values)
    .then((results) => {
      res.json({ data: "updated successfully", results });
    })
    .catch((error) => {
      res.json({ data: error });
    });
});

module.exports = Router;
