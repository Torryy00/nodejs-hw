import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const notesRouter = Router();

notesRouter.get('/notes', celebrate({ query: getAllNotesSchema }), getAllNotes);

notesRouter.get('/notes/:noteId', celebrate({ params: noteIdSchema }), getNoteById);

notesRouter.post('/notes', celebrate({ body: createNoteSchema }), createNote);

notesRouter.delete('/notes/:noteId', celebrate({ params: noteIdSchema }), deleteNote);

notesRouter.patch(
  '/notes/:noteId',
  celebrate({ params: noteIdSchema, body: updateNoteSchema }),
  updateNote,
);

export default notesRouter;