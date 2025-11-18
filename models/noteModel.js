let notes = [];
let idCounter = 1;

module.exports = {
  getAll: () => notes,
  getById: (id) => notes.find(note => note.id === id),
  create: (text) => {
    const newNote = { id: idCounter++, text };
    notes.push(newNote);
    return newNote;
  },
  update: (id, text) => {
    const note = notes.find(n => n.id === id);
    if (note) note.text = text;
    return note;
  },
  delete: (id) => {
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) return notes.splice(index, 1)[0];
    return null;
  }
};