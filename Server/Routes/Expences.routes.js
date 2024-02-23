const express = require("express");
const { pool } = require("../Config/db.config");
const tokenKey = process.env.tokenKey;
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const JWT = require("jsonwebtoken");
const { CurrentYMD } = require("../DateFormatter");
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
} = require("../Controllers/Expences.controller");
const router = express.Router();
router.post("/", () => {});
router.get("/", () => {});

router.post("/Expences/AddExpencesItems/", authMiddleware, AddExpencesItems);
router.post(
  "/Expences/updateMyexpencesList",
  authMiddleware,
  updateMyExpensesList
);
router.post("/Expences/deleteExpencesItem", authMiddleware, deleteExpenceItem);
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
