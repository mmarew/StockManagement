let cors = require("cors");
let express = require("express");
let bcrypt = require("bcryptjs");
let Auth = require("./Auth.js").Auth;
require("dotenv").config();
const tokenKey = process.env.tokenKey;
const { getUniqueBusinessName } = require("./UniqueBusinessName.js");
console.log("getUniqueBusinessName", getUniqueBusinessName);

let { CurrentYMD, isValidDateFormat } = require("./DateFormatter.js");
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-let
let Routes = require("./Routes/index.js");
let path = "/";
let server = express();
server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
server.use(Routes);
///////////////////////////////////////
const Databases = require("./Database.js");

// //console.log("fullTime is " + fullTime);
Databases.createBasicTables();
let jwt = require("jsonwebtoken");
const { pool } = require("./Config/db.config.js");
const { DateFormatter } = require("./DateFormatter.js");
let { insertIntoUserTable } = require("./Database.js");
const { authMiddleware } = require("./middleware/Auth.js");

try {
  server.listen(process.env.serverPort, (err) => {
    if (err) {
      return res.json({ err });
    } else {
      console.log(`connected at ${process.env.serverPort}`);
    }
  });
} catch (error) {
  console.log(error);
}
server.post(path, (req, res) => {
  res.end(
    "<h1><center>This is server is running well in post methodes.</center></h1>"
  );
});
server.get(path, async (req, res) => {
  res.json({ data: "it is working well" });
});

// i am here

async function getPreviousDay(date) {
  // Get the current date
  const currentDate = new Date(date);
  // Subtract one day from the current date
  const previousDate = new Date();
  previousDate.setDate(currentDate.getDate() - 1);

  // Extract the year, month, and day from the previous date
  const year = previousDate.getFullYear();
  const month = previousDate.getMonth() + 1; // Month is zero-based, so add 1
  const day = previousDate.getDate();

  // Format the date components as a string (YYYY-MM-DD)
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  //console.log("Previous day:", formattedDate);
  return formattedDate;
}

/////////////////

let x = [
  {
    mainProductId: 1,
    creditSalesQty: 120,
    creditDueDate: "",
    salesTypeValues: "On cash, On credit, On cash, ",
    Description: "description one Good and well 12121 ",
    productsUnitCost: 15000,
    productsUnitPrice: 18000,
    ProductId: 1,
    salesQuantity: 92,
    purchaseQty: 0,
    wrickageQty: 0,
    Inventory: -212,
  },
];

// pool system has to be tested

// ////////////////
