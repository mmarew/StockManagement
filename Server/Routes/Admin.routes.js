const express = require("express");
const { pool } = require("../Database");
const router = express.Router();

router.get("/admin__getUsers", async (req, res) => {
  let allusers = `select * from usersTable`;
  let [users] = await pool.query(allusers);

  res.json({ data: users });
});
router.get("/get__businesses", async (req, res) => {
  // console.log("req", res);'
  try {
    let get__businesses = `select * from Business, usersTable where userId=ownerId`;
    let [Result1] = await pool.query(get__businesses);
    res.json({ data: Result1 });
    console.log("Result1", Result1);
    console.log("get__businesses");
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = router;
