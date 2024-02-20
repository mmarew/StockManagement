let cors = require("cors");
let express = require("express");
require("dotenv").config();
const { getUniqueBusinessName } = require("./UniqueBusinessName.js");
console.log("getUniqueBusinessName", getUniqueBusinessName);

let Routes = require("./Routes/index.js");
let path = "/";
let server = express();

// Importing security modules
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

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
  max: 100, // limit each IP to 100 requests per windowMs
});
server.use(limiter);

// Import routes
server.use(Routes);

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
      return res.json({ err });
    } else {
      console.log(`connected at ${process.env.serverPort}`);
    }
  });
} catch (error) {
  console.log(error);
}

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
