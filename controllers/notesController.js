const Note = require('../models/noteModel');

exports.getAllNotes = (req, res) => res.json(Note.getAll());

exports.getNoteById = (req, res) => {
  const note = Note.getById(parseInt(req.params.id));
  note ? res.json(note) : res.status(404).json({ message: 'Note not found' });
};

exports.createNote = (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const newNote = Note.create(text);
  res.status(201).json(newNote);
};

exports.updateNote = (req, res) => {
  const { text } = req.body;
  const updated = Note.update(parseInt(req.params.id), text);
  updated ? res.json(updated) : res.status(404).json({ message: 'Note not found' });
};

exports.deleteNote = (req, res) => {
  const deleted = Note.delete(parseInt(req.params.id));
  deleted ? res.json(deleted) : res.status(404).json({ message: 'Note not found' });
};