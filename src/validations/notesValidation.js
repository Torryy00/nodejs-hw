import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
  getAllNotesSchema,
} from '../validations/notesValidation.js';

const notesRouter = Router();

// все роуты защищены
notesRouter.use(authenticate);

// GET all notes (ВАЖНО: query validation)
notesRouter.get(
  '/',
  celebrate({ query: getAllNotesSchema }),
  getAllNotes,
);

// GET note by id
notesRouter.get(
  '/:noteId',
  celebrate({ params: noteIdSchema }),
  getNoteById,
);

// CREATE note
notesRouter.post(
  '/',
  celebrate({ body: createNoteSchema }),
  createNote,
);

// UPDATE note
notesRouter.patch(
  '/:noteId',
  celebrate({
    params: noteIdSchema,
    body: updateNoteSchema,
  }),
  updateNote,
);

// DELETE note
notesRouter.delete(
  '/:noteId',
  celebrate({ params: noteIdSchema }),
  deleteNote,
);

export default notesRouter;