const { readDB, writeDB } = require("../../helpers/jsonDB");


module.exports = function (app) {
  app.post("/auth/register", (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Read existing users
    const users = readDB("users.json");

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    // Save back to JSON file
    writeDB("users.json", users);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  });
};