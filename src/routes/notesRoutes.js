import { Router } from 'express';
import { celebrate } from 'celebrate';

import authenticate from '../middleware/authenticate.js';

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
  idSchema,
} from '../validation/notesSchemas.js';

const notesRouter = Router();

// ❗ ВАЖНО: защита ВСЕХ routes
notesRouter.use(authenticate);

// GET all notes
notesRouter.get('/', getAllNotes);

// GET note by id
notesRouter.get('/:id', celebrate({ params: idSchema }), getNoteById);

// CREATE note
notesRouter.post(
  '/',
  celebrate({ body: createNoteSchema }),
  createNote
);

// UPDATE note
notesRouter.patch(
  '/:id',
  celebrate({
    params: idSchema,
    body: updateNoteSchema,
  }),
  updateNote
);

// DELETE note
notesRouter.delete(
  '/:id',
  celebrate({ params: idSchema }),
  deleteNote
);

export default notesRouter;