require("dotenv").config();
const jwt = require("jsonwebtoken");
const { pool, executeQuery } = require("../Config/db.config");
const bcrypt = require("bcryptjs");

let authMiddleware = (req, res, next) => {
  console.log("req.body", req.body);
  let tokenString = req.body.token;
  // console.log("req.params", req.params, " req.query====", req.query);
  // console.log("req.body", req.body);
  // console.log("in authMiddleware tokenString token", req.query);
  if (!tokenString) tokenString = req.query.token;
  console.log("tokenString", tokenString);
  if (!tokenString)
    return res.status(401).json({ error: "No token provided." });
  try {
    // Assuming 'datas' contains the token
    const token = jwt.verify(tokenString, process.env.tokenKey);

    // Attach the user ID to the request for future middleware or route handlers
    req.body.userID = token.userID;
    // console.log("token.userID", token.userID);
    // Call the next middleware or route handler
    return next();
  } catch (error) {
    console.error(error);
    // If token verification fails, you might want to send an error response
    return res.status(401).json({ error: "Unauthorized" });
  }
};

let authMiddleware2 = async (req, res, next) => {
  try {
    const { userPassword, userID } = req.body;
    console.log("userID", userID, "userPassword===", userPassword);
    // Use parameterized queries to prevent SQL injection
    const select = "SELECT * FROM usersTable WHERE userId = ? LIMIT 1";
    const rows = await executeQuery(select, [userID]);
    console.log("rows", rows);
    if (rows.length === 0) {
      // Use res.status().json() for consistent response
      return res.status(401).json({ error: "User not found." });
    }

    const savedPassword = rows[0].password;
    const isMatch = bcrypt.compareSync(userPassword, savedPassword);
    console.log("isMatch", isMatch);
    if (isMatch) {
      // Attach user information to the request for future middleware or route handlers
      req.userData = {
        userID: rows[0].userId,
        username: rows[0].username,
        // Add more user-related information if needed
      };
      return next();
    } else {
      // Use res.status().json() for consistent response
      return res.json({ data: "wrong Password." });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Use res.status().json() for consistent response
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { authMiddleware, authMiddleware2 };
