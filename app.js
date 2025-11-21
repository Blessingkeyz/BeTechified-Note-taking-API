const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);


require("./routes/notes")(app);

app.get("/", (req, res) => {
  res.send("Note Taking API by Group 4");
});

// Load Auth Routes
require("./routes/auth")(app);

// Load Notes Routes
require("./routes/notes")(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});