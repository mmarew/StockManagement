let cors = require("cors");
let express = require("express");
require("dotenv").config();
let Routes = require("./Routes/index.js");
let path = "/";
let server = express();
// Importing security modules
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

var corsOptions = {
  origin: [
    `https://stock.masetawosha.com`,
    `http://localhost:5173`,
    `http://localhost:5174`,
    `196.188.33.195`,
    `196.189.127.142`,
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

// Apply security modules
server.use(helmet());

// Implement rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
});
// server.use(limiter);

// Import routes

const Databases = require("./Database.js");

Databases.createBasicTables();

server.post(path, (req, res) => {
  res.end(
    "<h1><center>This server is running well in post methods.</center></h1>"
  );
});

server.get(path, async (req, res) => {
  res.json({ data: "it is working well" });
});

try {
  server.listen(process.env.serverPort, (err) => {
    if (err) {
      console.log("err");
      return res.json({ err });
    } else {
      console.log("connected @ ", process.env.serverPort);
    }
  });
} catch (error) {}

// Input validation and sanitization
server.post(
  "/path",
  [
    // Validate and sanitize fields
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }).trim(),
  ],
  (req, res) => {
    // Handle the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Proceed with the request handling
  }
);
server.use(Routes);
