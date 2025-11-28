const { readDB, writeDB } = require("../../helpers/jsonDB");

module.exports = function (app) {
    app.delete("/notes/:id", (req, res) => {
        const noteId = req.params.id;

        // Get all notes
        const notesDB = readDB("notes");

        // Find note
        const noteIndex = notesDB.findIndex(note => String(note.id) === String(noteId));

        if (noteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Remove the note
        notesDB.splice(noteIndex, 1);

        // Save back to DB
        writeDB("notes", notesDB);

        return res.json({
            success: true,
            message: "Note deleted successfully"
        });
    });
};
