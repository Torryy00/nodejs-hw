import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

export const notesRouter = express.Router();

notesRouter.get('/', getAllNotes);
notesRouter.get('/:noteId', getNoteById);
notesRouter.post('/', createNote);
notesRouter.delete('/:noteId', deleteNote);
notesRouter.patch('/:noteId', updateNote);