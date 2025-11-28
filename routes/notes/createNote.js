const { readDB, writeDB } = require("../../helpers/jsonDB");

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}

module.exports = function (app) {
  app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing title or content" });
    }

    const cookies = parseCookies(req.headers.cookie);
    const userId = cookies.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const notes = readDB("notes.json") || [];

    const userNotes = notes.filter((n) => n.userId == userId);

    const newId = userNotes.length ? userNotes[userNotes.length - 1].id + 1 : 1;

    const newNote = {
      id: newId,
      userId: Number(userId),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);

    // Save all notes
    writeDB("notes.json", notes);

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  });
};
