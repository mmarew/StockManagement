const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { authMiddleware } = require("../middleware/Auth");

const Router = require("express").Router();
const path = "/";

Router.post(path + "/updateCostData/", authMiddleware, async (req, res) => {
  // let businessName = req.body.businessName,
  //   CostName_ = req.body.CostName_,
  //   costsId = req.body.costsId;
  let { businessName, CostName_, costsId, businessId, userID } = req.body;

  businessName = await getUniqueBusinessName(businessId, userID);
  console.log("@updateCostData businessName", businessName);
  const updateQuery = `UPDATE ?? SET costName=? WHERE costsId=?`;
  let values = [businessName + "_Costs", CostName_, costsId];
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
Router.post(path + "getCostLists/", authMiddleware, async (req, res) => {
  // //console.log(req.body);
  let { businessId, userID } = req.body;
  let businessName = await getUniqueBusinessName(businessId, userID);
  if (businessName == "you are not owner of this business") {
    return res.json({ data: businessName });
  }
  let select = `select * from ??`;
  pool
    .query(select, [`${businessName}_Costs`])
    .then(([rows]) => {
      //console.log("line 458", rows);
      res.json({
        data: rows,
      });
      //// //console.log(businessName);
    })
    .catch((error) => {
      res.json({ data: "err", err: "error 111" });
    });
});
module.exports = Router;
