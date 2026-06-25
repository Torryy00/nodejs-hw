import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      req.body,
      { new: true }
    );
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (e) {
    next(e);
  }
};