const { readDB } = require("../../helpers/jsonDB");

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
  app.get("/notes", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const userId = cookies.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const notes = readDB("notes.json") || [];
    const userNotes = notes.filter((n) => n.userId == userId);

    return res.json({
      message: "Notes fetched successfully",
      notes: userNotes,
    });
  });

  app.get("/notes/:id", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const userId = cookies.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const noteId = parseInt(req.params.id);
    const notes = readDB("notes.json") || [];

    const note = notes.find((n) => n.id === noteId && n.userId == userId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.json({
      message: "Single note fetched successfully",
      note,
    });
  });
};
