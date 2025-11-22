const { readDB, writeDB } = require("../../helpers/jsonDB");

module.exports = function (app) {
  app.post("/auth/register", (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: ["All fields are required"] });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: ["Invalid email format"] });
    }

    // Password validation
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&* etc.)");
    }
    if (/password/i.test(password)) {
      errors.push("Password cannot contain the word 'password'");
    }
    if (/^(.)\1+$/.test(password)) {
      errors.push("Password cannot be made of repeated characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({ msg: errors });
    }

    // Read existing users
    const users = readDB("users.json");

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ msg: ["User already exists"] });
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password // stored as plain text for simplicity
    };

    users.push(newUser);

    // Save back to JSON file
    writeDB("users.json", users);

    res.status(201).json({ msg: ["User registered successfully"], user: newUser });
  });
};