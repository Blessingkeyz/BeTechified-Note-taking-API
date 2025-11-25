 //updatedAt is added

const { readDB, writeDB } = require("../../helpers/jsonDB");

// PUT /notes/:id
module.exports = (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const { title, content } = req.body;

    const idx = db.notes.findIndex(n => String(n.id) === String(id));
    if (idx === -1) {
        return res.status(404).json({ error: "Note not found" });
    }

    const note = db.notes[idx];
    const updated = {
        ...note,
        title: title ?? note.title,
        content: content ?? note.content,
        updatedAt: new Date().toISOString()
    };

    db.notes[idx] = updated;
    writeDB(db);

    return res.json(updated);
};