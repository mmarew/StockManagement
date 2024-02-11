const Router = require("express").Router();
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");
let {
  createBusiness,
  getBusiness,
  deleteBusiness,
  updateBusinessName,
} = require("../Controllers/Business.controllers");
// console.log("Business", Business);
Router.post("/business/createbusiness", authMiddleware, createBusiness);
Router.post("/business/getBusiness", authMiddleware, getBusiness);
Router.post(
  "/business/deleteBusines",
  authMiddleware,
  authMiddleware2,
  deleteBusiness
);
Router.post("/business/updateBusinessName", authMiddleware, updateBusinessName);
Router.post("/removeEmployeersBusiness/", async (req, res) => {
  const userID = await Auth(req.body.token);
  const getEmployeerBusiness = `SELECT * FROM employeeTable WHERE userIdInEmployee = ? AND BusinessIDEmployee = ?`;
  const getEmployeerBusinessValues = [userID, req.body.BusinessID];

  pool
    .query(getEmployeerBusiness, getEmployeerBusinessValues)
    .then((results) => {
      if (results.length > 0) {
        const deleteData = `DELETE FROM employeeTable WHERE userIdInEmployee = ? AND BusinessIDEmployee = ?`;
        const deleteDataValues = [userID, req.body.BusinessID];
        return pool
          .query(deleteData, deleteDataValues)
          .then((resultsOfSelect) => {
            if (resultsOfSelect) {
              return res.json({ data: resultsOfSelect });
            } else {
              return res.json({ data: "alreadyDeleted" });
            }
          })
          .catch((error) => {
            //console.log(error);
            return res.json({ data: error });
          });
      } else {
        return res.json({ data: "NoDataLikeThis" });
      }
    })
    .catch((error) => {
      //console.log(error);
      return res.json({ data: error });
    });
});
// getBusiness;
module.exports = Router;
