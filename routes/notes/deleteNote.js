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
  app.delete("/notes/:id", (req, res) => {
    const noteId = Number(req.params.id);

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

    // Remove the note
    const deletedNote = notes.splice(noteIndex, 1);

    writeDB("notes.json", notes);

    return res.json({
      message: "Note deleted successfully",
      deleted: deletedNote[0],
    });
  });
};
