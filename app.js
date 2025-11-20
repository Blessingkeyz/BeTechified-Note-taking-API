require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT;

app.use(express.json());

require("./routes/notes")(app);

app.get("/", (req, res) => {
  res.send("Note Taking API by Group 4");
});

// Load Auth Routes
require("./routes/auth")(app);

// Load Notes Routes
require("./routes/notes")(app);

app.listen(port, () => {
  console.log(`Week 2 App listening on port ${port}`);
});
