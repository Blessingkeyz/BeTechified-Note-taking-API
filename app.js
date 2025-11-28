require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

require("./routes/notes")(app);

app.get("/", (req, res) => {
  res.send("Note Taking API by Group 4");
});

require("./routes/auth")(app);

require("./routes/notes")(app);

app.listen(port, () => {
  console.log(`Note App listening on port ${port}`);
});
