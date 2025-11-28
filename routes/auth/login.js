const { readDB, writeDB } = require("../../helpers/jsonDB");

module.exports = function (app) {
  app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: ["Email and password are required"] });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: ["Invalid email format"] });
    }

    const users = readDB("users.json");

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ msg: ["Invalid email or password"] });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ msg: ["Invalid email or password"] });
    }
    res.cookie("userId", user.id, {
      httpOnly: true,
    });
    return res.status(200).json({
      msg: ["Login successful"],
      user,
    });
  });
};
