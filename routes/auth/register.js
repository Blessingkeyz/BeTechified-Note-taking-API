const { readDB, writeDB } = require("../../helpers/jsonDB");

module.exports = function (app) {
  app.post("/auth/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Password strength check
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character",
      });
    }

    // Read existing users
    const users = readDB("users.json");

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    // Save back to JSON file
    writeDB("users.json", users);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  });
};