const express = require("express");
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");
const {
  searchExpByName,
  getExpencesLists,
  deleteExpenceItem,
  getExpTransactions,
  AddExpencesItems,
  registerExpenseTransaction,
  updateMyExpensesList,
  updateExpencesItem,
  deleteExpenceTransaction,
} = require("../Controllers/Expences.controller");
const router = express.Router();
router.post("/", () => {});
router.get("/", () => {});
router.post(
  "/Expences/deleteExpenceTransaction/",
  authMiddleware,
  authMiddleware2,
  deleteExpenceTransaction
);

router.post("/Expences/AddExpencesItems/", authMiddleware, AddExpencesItems);
router.post(
  "/Expences/updateMyexpencesList",
  authMiddleware,
  updateMyExpensesList
);
router.post(
  "/Expences/deleteExpencesItem",
  authMiddleware,
  authMiddleware2,
  deleteExpenceItem
);
router.post(
  `/Expences/registerExpenceTransaction/`,
  authMiddleware,
  registerExpenseTransaction
);
router.get("/Expences/getExpTransactions", authMiddleware, getExpTransactions);
router.post(
  "/deleteExpenceItem",
  authMiddleware,
  authMiddleware2,
  deleteExpenceItem
);
router.get("/getExpencesLists/", authMiddleware, getExpencesLists);

router.post("/searchExpByName", authMiddleware, searchExpByName);
router.post("/updateExpencesItem/", authMiddleware, updateExpencesItem);

module.exports = router;
