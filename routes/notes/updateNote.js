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
  app.put("/notes/:id", (req, res) => {
    const { title, content } = req.body;
    const noteId = Number(req.params.id);

    if (!title && !content) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const cookies = parseCookies(req.headers.cookie);
    const userId = cookies.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const notes = readDB("notes.json") || [];
    const noteIndex = notes.findIndex(
      (n) => n.id === noteId && n.userId == userId
    );

    if (noteIndex === -1) {
      return res
        .status(404)
        .json({ error: "Note not found or not owned by user" });
    }

    // Update only provided fields
    if (title) notes[noteIndex].title = title;
    if (content) notes[noteIndex].content = content;

    writeDB("notes.json", notes);

    return res.json({
      message: "Note updated successfully",
      note: notes[noteIndex],
    });
  });
};
