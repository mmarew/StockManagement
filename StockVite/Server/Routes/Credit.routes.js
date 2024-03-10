const express = require("express");
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth");
const controllerData = require("../Controllers/Credit.controller");
const router = express.Router();
require("dotenv").config();

router.get(
  "/Credit/getUsersCreditList",
  authMiddleware,
  controllerData.getCreditList
);

router.post(
  "/updatePartiallyPaidInfo",
  authMiddleware,
  authMiddleware2,
  controllerData.updatePartiallyPaidInfo
);

router.put("/confirmPayments", authMiddleware, controllerData.confirmPayments);

module.exports = router;
