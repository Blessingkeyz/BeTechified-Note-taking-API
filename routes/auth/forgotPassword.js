const { readDB, writeDB } = require("../../helpers/jsonDB");

module.exports = function (app) {
  app.post("/auth/forgot-password", (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ msg: ["Email and new password are required"] });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: ["Invalid email format"] });
    }

    const errors = [];

    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(newPassword)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push("Password must contain at least one number");
    }
    if (/^(.)\1+$/.test(newPassword)) {
      errors.push("Password cannot be made of repeated characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({ msg: errors });
    }

    // Read users DB
    const users = readDB("users.json");

    // Find user
    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) {
      return res.status(400).json({ msg: ["User not found"] });
    }

    users[userIndex].password = newPassword;

    writeDB("users.json", users);

    return res.status(200).json({
      msg: ["Password updated successfully"],
      user: users[userIndex],
    });
  });
};
