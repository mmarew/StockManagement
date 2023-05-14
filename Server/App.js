let express = require("express");
let app = express();
app.get("/", (req, res) => {
  res.end("connected");
});
app.listen(1010, (err) => {
  if (err) console.log(err);
  else console.log("connected");
});
