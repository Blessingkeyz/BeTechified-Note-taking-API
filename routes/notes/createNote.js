// id, title, content, createdAt
const { readDB, writeDB } = require("../../helpers/jsonDB");
// create a new note
module.exports = function (app) {
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
    if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
    }
    // read existing notes from the database
    const notes =  readDB("notes.json") || [];
    // create a new note with createdAt 
    const newNote = {
        id: notes.length ? notes[notes.length - 1].id + 1 : 1,
        title,
        content,
        createdAt: new Date().toISOString()
    };
    // add the new note to the notes array
    notes.push(newNote);
    // write the updated notes array back to the database
     writeDB("notes", notes);
    // respond with the newly created note
    res.status(201).json({
        message : "Note created successfully",
        note: newNote
    });         
});
};
