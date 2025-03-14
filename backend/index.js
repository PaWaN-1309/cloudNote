const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors');

connectToMongo();
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json()); // Middleware needed to use req.body

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`CloudNote backend listening on port ${port}`);
});
